import { AfterViewInit, Component, ElementRef, HostListener, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import * as dat from 'lil-gui';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import * as CANNON from 'cannon';
import { JSONPath } from 'jsonpath-plus';

import * as test_prerender from './prerenders/test-prerender.json';
import * as event_map_a from './prerenders/event-map-a.json';
import * as event_map_b from './prerenders/event-map-b.json';
import { ActivatedRoute, Router } from '@angular/router';
import { SimulationDto, SimulationServiceProxy, GetSimulationInput, UserLoginInfoDto } from '@shared/service-proxies/service-proxies';
import { ChatMessageDto, ChatSignalrService } from '@app/common/chat/chat-signalr.service';
import { SceneCastingSignalrService } from '@app/common/scene-casting/scene-casting-signalr.service';
import { LayoutStoreService } from '@shared/layout/layout-store.service';

import { MeshFactory } from './factories/mesh-factory';
import { MaterialFactory } from './factories/material-factory';
import { CameraFactory } from './factories/camera-factory';
import { DatGuiHelper } from './helpers/dat-gui-helpers';
import { PickerHelper } from './helpers/picker-helper';
import { CommandPrototypeRegistry } from './registries/command-prototype-registry';
import { PrototypeRegistry } from './registries/prototype-registry';
import { CannonPhysicsEngine } from './engines/cannon-physics-engine';
import { PhysicalBodyTypes, ThreeJsGemoetriesMap } from './engines/cannon-physics-engine';

/* REFERENCES
https://medium.com/geekculture/hello-cube-your-first-three-js-scene-in-angular-176c44b9c6c0
*/

// TODO: move
interface MeshBody {
  mesh: THREE.Mesh;
  body: CANNON.Body;
}

@Component({
  templateUrl: './view-simulation.component.html',
  styleUrls: ['./view-simulation.component.less'],
  animations: [appModuleAnimation()]
})
export class ViewSimulationComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {

  //#region Element References

  @ViewChild('guidedCanvas')
  private _guidedCanvasRef: ElementRef;
  private get gCanvas(): HTMLCanvasElement {
    return this._guidedCanvasRef.nativeElement;
  }

  @ViewChild('guidedConfigPanel')
  private _guidedConfigPanelRef: ElementRef<HTMLDivElement>;
  private get gConfigPanel(): HTMLDivElement {
    return this._guidedConfigPanelRef.nativeElement;
  }

  private nullifyGuidedConfigPanel() {
    return this._guidedConfigPanelRef.nativeElement.innerHTML = '';
  }

  @ViewChild('exploratoryCanvas')
  private _exploratoryCanvasRef: ElementRef;
  private get eCanvas(): HTMLCanvasElement {
    return this._exploratoryCanvasRef.nativeElement;
  }

  @ViewChild('exploratoryConfigPanel')
  private _exploratoryConfigPanelRef: ElementRef<HTMLDivElement>;
  private get eConfigPanel(): HTMLDivElement {
    return this._exploratoryConfigPanelRef.nativeElement;
  }

  private nullifyExploratoryConfigPanel() {
    return this._exploratoryConfigPanelRef.nativeElement.innerHTML = '';
  }

  //#endregion Element References

  //#region Cameras

  private _gCamera!: THREE.Camera;
  private _eCamera!: THREE.Camera;

  //#endregion Cameras

  //#region Renderers

  private _gRenderer!: THREE.WebGLRenderer;
  private _eRenderer!: THREE.WebGLRenderer;

  //#endregion Renderers

  //#region Scenes

  private _prerender: any;
  private _gScene!: THREE.Scene;
  private _eScene!: THREE.Scene;

  //#endregion Scenes

  //#region Ray Casters

  private _gRaycaster = new THREE.Raycaster();
  private _gRayIntersects: any = null;
  private _eRaycaster = new THREE.Raycaster();
  private _eRayIntersects: any[] = null;

  //#endregion Ray Casters

  //#region Controls

  private _gConfigGui!: dat.GUI;
  private _eConfigGui!: dat.GUI;

  private _gParams = {};
  private _eParams = {};

  private _gControls = null;
  private _eControls = null;

  //#endregion Controls

  private _info: string = "";
  public get info(): string {
    return this._info;
  }

  //#region Trackers

  private _gMeshTrackers: THREE.Mesh[] = [];
  private _eMeshTrackers: THREE.Mesh[] = [];

  private _mouseTracker = new THREE.Vector2();

  private _gBodyTrackers: MeshBody[] = [];

  private _gSelectedMeshUuids: string[] = [];

  private _clock = new THREE.Clock();

  public objectMovementEnabled: boolean = true;

  // This is temporary, while we are loading from dummy JSON
  private _rawEventsMap: {} = undefined;
  private _eventsMap = {
    collide: undefined,
    clicks: undefined,
  };

  //#endregion Trackers

  //#region Helpers

  private _meshFactory: MeshFactory;
  private _materialFactory: MaterialFactory;
  private _cameraFactory: CameraFactory;
  private _datGuiHelper: DatGuiHelper;
  private _pickerHelper: PickerHelper;
  private _commandPrototypeRegistry: CommandPrototypeRegistry;
  private _prototypeRegistry: PrototypeRegistry;
  private _physicsEngine: CannonPhysicsEngine;  

  //#endregion Helpers

  busy: boolean = false; 

  constructor(
    injector: Injector,
    private _activatedRoute: ActivatedRoute,
    private _simulationsService: SimulationServiceProxy,
    private _chatSignalrService: ChatSignalrService,
    private _sceneCastingSignalrService: SceneCastingSignalrService,
    private _router: Router,
    private _layoutStore: LayoutStoreService,
  ) {
    super(injector);

    this._meshFactory = new MeshFactory();
    this._materialFactory = new MaterialFactory();
    this._cameraFactory = new CameraFactory();
    this._datGuiHelper = new DatGuiHelper();
    this._pickerHelper = new PickerHelper();
    this._commandPrototypeRegistry = new CommandPrototypeRegistry();
    this._prototypeRegistry = new PrototypeRegistry();
    this._physicsEngine = new CannonPhysicsEngine();
  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params) => {
      // Defaults to 0 if no query param provided.
      this.classroomId = +params['id'] || undefined;
      this._eventMapId = +params['evid'] || undefined;

      const ind = this._eventMapId ? this._eventMapId : Math.round(Math.random());
    let event_map = event_map_a;
    if (ind === 1) {
      event_map = event_map_b;
    } 

    this._info = `EVENT MAP ${ind === 1 ? 'B (scale & transform)' : 'A (rotation)'} was chosen`;

    // Because JSON will never assume that there is only one occurence of a thing in a list
    // This is returned as a list of effects, ie a list of lists
    const listOfLists = JSONPath({json: event_map, path: "$.triggers[?(@.cause=='click')].effects"});
    const clickEffects = listOfLists[0];

    this._eventsMap = {
      collide: this.playHitSound,
      clicks: clickEffects
    };
    });   

    
  }

  ngOnDestroy() {
    
  }

  ngAfterViewInit(): void {
    this._readyToRender = true;
    // Weird, but setting true collapses the sidebar.
    this._layoutStore.setSidebarExpanded(true);
  }

  //#region Rendering Handlers

  // ngAfterView complete - ie. UI has loaded.
  private _readyToRender: boolean = false;
  // API call has completed - scene data is available.
  private _simulationDataReceived: boolean = false;


  private _isRenderingActive: boolean = false;
  private updateRendering() {
    if (!this._readyToRender || !this._simulationDataReceived) {
      this.clearGuidedScene();
      this.clearExploratoryScene();
      this._isRenderingActive = false;

      return this._isRenderingActive;
    }

    if (!this._isRenderingActive) {
      this.createRendering();
      this._isRenderingActive = true;
    }
  }

  private createRendering(): void {
    this.createGuidedScene();
    this.createExploratoryScene();

    this.initWorld();
    this.initMaterial();
    this.initFloor();
    this.setupFloor();
    this.addAmbientLight();
    this.setupLight();

    this.startRenderingLoop();

    this.tick();
  }

  private startRenderingLoop() {
    //* Renderer
    this._gRenderer = new THREE.WebGLRenderer({ canvas: this.gCanvas });
    this._gRenderer.shadowMap.enabled = true
    this._gRenderer.shadowMap.type = THREE.PCFSoftShadowMap
    this._gRenderer.setPixelRatio(devicePixelRatio);
    this._gRenderer.setSize(this.gCanvas.clientWidth, this.gCanvas.clientHeight);

    // TODO: remove later
    // console.log(`${JSON.stringify(this._gScene.toJSON())}`);

    this._eRenderer = new THREE.WebGLRenderer({ canvas: this.eCanvas });
    this._eRenderer.setPixelRatio(devicePixelRatio);
    this._eRenderer.setSize(this.eCanvas.clientWidth, this.eCanvas.clientHeight);

    let component: ViewSimulationComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component._gRenderer.render(component._gScene, component._gCamera);
      component._eRenderer.render(component._eScene, component._eCamera);
    }());
  }

  private _oldElapsedTime = 0;
  private tick = () =>
  {
      const elapsedTime = this._clock.getElapsedTime();
      const deltaTime = elapsedTime - this._oldElapsedTime;
      this._oldElapsedTime = elapsedTime;

      // Update physics
      this.world.step(1 / 60, deltaTime, 3);

      for(const object of this._gBodyTrackers)
      {
          object.mesh.position.copy(object.body.position);
          object.mesh.quaternion.copy(object.body.quaternion);
      }

      if (this.amICasting) {
        this.castGuidedViewParams();
      }

      if (this.isSomeoneCasting && !this.amICasting) {   
        this.renderParamsCasting();
      }

      // this._gRayIntersects = this._gRaycaster.intersectObjects(this._gMeshTrackers);
      // this._gRaycaster.setFromCamera(this._mouseTracker, this._gCamera);
      // this._eRayIntersects = this._eRaycaster.intersectObjects(this._eMeshTrackers);
      // this._eRaycaster.setFromCamera(this._mouseTracker, this._eCamera);

      

      if (this._gControls && this._eControls) {
        // Update controls
        this._gControls.update();
        this._eControls.update();

        // Render
        this._gRenderer.render(this._gScene, this._gCamera);
        this._eRenderer.render(this._eScene, this._eCamera);

        // Call tick again on the next frame
        window.requestAnimationFrame(this.tick);
      }
  }

  //#endregion Rendering Handlers

  //#region Chat Handlers

  private _simulationGroupName: string = undefined;

  private _currentUser: UserLoginInfoDto = this.appSession.user;
  public get username():string {
    return this._currentUser?.userName ?? this.l('User');
  }

  public get isChatConnected(): boolean {
    return this._chatSignalrService.isConnected;
  }
  public get chatMessages(): ChatMessageDto[] {
    return this._chatSignalrService.messages;
  }

  chatMessage: string = '';

  public sendMessageToGroup() {
    if (this.chatMessage && this.chatMessage.length > 0) {
      this._chatSignalrService.sendMessage(this.chatMessage, this._simulationGroupName, this.username, null);
      this.chatMessage = undefined;
    }
  }

  public isMyMessage(messageUsername: string): boolean {
    return messageUsername === this.username;
  }

  public getDateForDisplay(date: string): string {
    return new Date(date).toLocaleTimeString();
  }

  //#endregion Chat Handlers

  private _eventMapId: number = 0;

  //#region Classroom Handlers

    private _simulationId: number = undefined;
    get classroomId(): number {
      return this._simulationId;
    }
    set classroomId(value: number) {
        this._simulationId = value;
        if (this._simulationId !== undefined) {
            this.joinClassroom();
        }
    }

    private _simulation: SimulationDto = undefined;
    get classroom(): SimulationDto {
      return this._simulation;
    }
    set classroom(value: SimulationDto) {
        this._simulation = value;
        if (this._simulation !== undefined) {
            // TODO: do stuff
        }
    }

    joinClassroom(): void {
      this.busy = true;

      let input = new GetSimulationInput();
      input.id = this.classroomId;

      this._simulationsService
          .join(input)
          .pipe(
              finalize(() => {
                  this.busy = false;
              })
          )
          .subscribe((result) => {
              this.classroom = result;
              this._simulationGroupName = `simulation${this.classroom.id}`;
              this.joinServiceGroups();

              this._simulationDataReceived = true;

              this.updateRendering();
          });
    }

    leaveClassroom(): void {
      this.busy = true;

      let input = new GetSimulationInput();
      input.id = this.classroomId;

      this._simulationsService
          .leave(input)
          .pipe(
              finalize(() => {
                  this.busy = false;
              })
          )
          .subscribe((result) => {
              this.clearGuidedScene();
              this.clearExploratoryScene();
              this._chatSignalrService.leaveGroup(this._simulationGroupName, this.username, null);
              this._sceneCastingSignalrService.leaveGroup(this._simulationGroupName, this.username, null);

              this._router.navigate(['app/simulations']);
          });
    }

    private joinServiceGroups() {
      this._chatSignalrService.joinGroup(this._simulationGroupName, this.username, null);
      this._sceneCastingSignalrService.joinGroup(this._simulationGroupName, this.username, null);
    }

    //#endregion Classroom Handlers

  //#region Scene Casting Handlers

  public get isCastConnected(): boolean {
    return this._sceneCastingSignalrService.isConnected;
  }
  private _isCasting: boolean = false;
  public get isCasting(): boolean {
    return this._isCasting;
  }
  public set isCasting(value: boolean) {
    if (!value) {
      this._isCasting = false;
    }

    this._isCasting = value;
  }
  public get isSomeoneCasting(): boolean {
    return this._sceneCastingSignalrService.isCastingActive;
  }
  public get amICasting(): boolean {
    return this.isCasting;
  }

  public tryToReconnectToCastingService(): void {
    this.joinServiceGroups();
  }

  public toggleCasting() {
    this.isCasting = !this.isCasting;
    this._sceneCastingSignalrService.setIsCasting(this.isCasting, this._simulationGroupName, null);
  }

  private castGuidedViewParams() { 

    const physicalObjects = this._gBodyTrackers.map(obj => {
      return {
        type: ThreeJsGemoetriesMap[obj.mesh.geometry.type],
        mesh: {
          uuid: obj.mesh.uuid,
          position: obj.mesh.position,
          scale: obj.mesh.scale,
          geometry: {
            type: obj.mesh.geometry.type,
          },
        },
        body: {
          position: obj.body.position,
          quaternion: obj.body.quaternion,
        }
      };
    });

    const casting = {
      params: this._gParams,
      physicalObjects: physicalObjects,
      camera: this._gCamera.position,
    };
    
    const castingJson = JSON.stringify(casting);
    this._sceneCastingSignalrService.sendCasting(castingJson, this._simulationGroupName, null);
  }

  private renderParamsCasting() {
    const latest = this._sceneCastingSignalrService.lastCasting;
    if (latest) {
      const casting = JSON.parse(latest);

      // _.forEach(casting.params, (cParam, cKey: any) => {
      //   let gParam = this._gParams[cKey];

      //   Object.keys(gParam).map((key, index) => {
      //     gParam[key] = cParam[key];
      //   });
      // });

      const eventsMap = {
        collide: this.playHitSound
      };

      _.forEach(casting.physicalObjects, (phyObj) => {
        // does the body exist?
        let gBody = this._gBodyTrackers.find(body => body.mesh.uuid === phyObj.mesh.uuid);

        if (gBody) {
          // Physical object pair already exists in world - update.

          // Update the body - tick will update the mesh - otherwise body objects will fall out of sync.
          gBody.body.position.copy(phyObj.body.position);
          gBody.body.quaternion.copy(phyObj.body.quaternion);
        } else {
          // Physical object pair does not yet exist in this world - create.

          const mesh = phyObj.mesh;

          const options: any = {
            type: ThreeJsGemoetriesMap[mesh.geometry.type],
            position: mesh.position,
            scale: mesh.scale,
            bodyMaterial: this.defaultMaterial,
            uuid: mesh.uuid,
          };

          this._physicsEngine.manifestPhysicalObject(options, this._gScene, eventsMap, this.world, this._gBodyTrackers);
        }
      });

      const castedMeshUuids = casting.physicalObjects.map(phyObj => phyObj.mesh.uuid);
      const renderedMeshUuids = this._gBodyTrackers.map(rendObj => rendObj.mesh.uuid);

      const objectsToRemove = renderedMeshUuids.filter(rUuid => !castedMeshUuids.includes(rUuid));
      _.forEach(objectsToRemove, (rendObjUuid) => {
        const phyObj = this._gBodyTrackers.find(obj => obj.mesh.uuid === rendObjUuid);
        this._physicsEngine.removeBody(phyObj, eventsMap, this._gScene, this.world);
      });


      this._gCamera.position.copy(casting.camera);
    }
  }

  //#endregion Scene Casting Handlers

  //#region Scene Handlers

  private _useTestPrerender: boolean = false;

  private clearGuidedScene() {
    for(const object of this._gBodyTrackers)
    {
        this._physicsEngine.removeBody(object, this._eventsMap, this._gScene, this.world);
    }
    
    this._gBodyTrackers.splice(0, this._gBodyTrackers.length);

    this._gScene.clear();
    this.nullifyGuidedConfigPanel();
    this._gParams = {};
    this._gMeshTrackers = [];
    this._gControls = null;
  }

  public resetGuidedScene() {
    this.clearGuidedScene();
    this.createGuidedScene();
  }

  public clearExploratoryScene() {
    // TODO: complete
    // for(const object of this.eBodyTrackers)
    // {
    //     this._physicsEngine.removeBody(object, this._eventsMap, this._eScene, this.world);
    // }
    
    // this.eBodyTrackers.splice(0, this.gBodyTrackers.length);

    this._eScene.clear();
    this.nullifyExploratoryConfigPanel();
    this._eParams = {};
    this._eMeshTrackers = [];
    this._eControls = null;
  }

  public resetExploratoryScene() {
    this.clearExploratoryScene();
    this.createExploratoryScene();
  }

  public mirrorGuidedView() {
    this._eScene.clear();
    this.clearExploratoryScene();

    const sceneJson = this._gScene.toJSON();

    // Debug
    this._eConfigGui = this._datGuiHelper.createConfigPanel(this.eConfigPanel);

    //* Scenes
    this._eScene = this.populateScene(sceneJson, this._eConfigGui, this._eParams, this._eMeshTrackers, this._eCamera);

    //* Camera
    // TODO: necessary?
    // this._eCamera = this.creat_eCamera(this.eCanvas);

    const farClippingPane = this._cameraFactory.getFarClippingPane(this._eCamera);
    this._datGuiHelper.addCameraFolder(this._eConfigGui, this._eCamera, farClippingPane);

    this._eConfigGui.close();

    // Controls
    this._eControls = this.createControls(this._eCamera, this.eCanvas);
  }

  private parse3DObjects(parent: THREE.Object3D, meshRefs: THREE.Mesh[], camera: THREE.Camera, scene: THREE.Scene, gui?: dat.GUI, controlParams?: any) {
    // debugger;
// TODO
// var loader = new THREE.OBJLoader();
// loader.load( mURL, function ( object ) {
//     object.traverse(function ( child ) {
//         if ( child instanceof THREE.Mesh ) {
//             child.geometry.computeBoundingBox();
//         }
//     });
// };

// } OR
// object.traverse(function ( child ) {
//   if ( child instanceof THREE.Mesh ) {
//       child.geometry.computeBoundingBox();
//       object.bBox = child.geometry.boundingBox;//<-- Actually get the variable
//   }
// });

    if (parent && parent.children && parent.children.length > 0) {
      parent.children.forEach(obj => {

        const isCamera = this._cameraFactory.isCamera(obj);
        if (isCamera) {
          camera = this._cameraFactory.castOut(obj);
          scene.add(camera);
          return; // continue
        }

        const isMesh = this._meshFactory.isMesh(obj);
        if (isMesh) {
          const mesh = this._meshFactory.castOut(obj);
          meshRefs.push(mesh);
          scene.add(mesh);

          if (gui && controlParams) {
            const meshUuid = mesh.uuid;
            const farClippingPane = 1000; // TODO: fix - camera does not exist here, it is created above, but lost in sequence.
            const params = this._datGuiHelper.addMeshConfiguration(gui, `Mesh`, mesh, farClippingPane);
      
            controlParams[meshUuid] = params; 
          }

          return; // continue
        }

        this.parse3DObjects(obj, meshRefs, camera, scene, gui, controlParams);
      });
    }

  }

  private populateScene(metaJson: any, gui: dat.GUI, controlParams: any, meshRefs: THREE.Mesh[], camera: THREE.Camera): THREE.Scene {
    const loader = new THREE.ObjectLoader();

    try {
      const scene = new THREE.Scene();
      
      const objectMap = loader.parse(metaJson);

      // TODO: is this needed?
      // this.parse3DObjects(scene, meshRefs, camera, scene, gui, controlParams);

      scene.add( objectMap );
      
      return scene;
    } catch (err) {
      throw Error(`Unable to populate scene - scene data is invalid. \m ${JSON.stringify(err)}`);
    }
  }

  private createGuidedScene() {
    // Debug
    this._gConfigGui = this._datGuiHelper.createConfigPanel(this.gConfigPanel);

    //* Scenes
    this._prerender = undefined;
    if (this._useTestPrerender) {
      this._prerender = test_prerender;
    } else {
      this._prerender = JSON.parse(this.classroom.initialSceneJson);
    }

    // TODO: check json is valid
    this._gScene = this.populateScene(this._prerender, this._gConfigGui, this._gParams, this._gMeshTrackers, this._gCamera);

    this._gScene.background = new THREE.Color( 0x25274d );

    // this._pickerHelper.addHelpers(this._gScene);

    //* Camera
    if (!this._gCamera) {
      // No camera found on scene
      this._gCamera = this._cameraFactory.createPerspectiveCamera(this.gCanvas);
    }    

    const farClippingPane = this._cameraFactory.getFarClippingPane(this._gCamera);
    this._datGuiHelper.addCameraFolder(this._gConfigGui, this._gCamera, farClippingPane);

    this._gConfigGui.close();

    // Controls
    this._gControls = this.createControls(this._gCamera, this.gCanvas);
  }

  private createExploratoryScene() {
    // Debug
    this._eConfigGui = this._datGuiHelper.createConfigPanel(this.eConfigPanel);

    //* Scenes
    this._prerender = undefined;
    if (this._useTestPrerender) {
      this._prerender = test_prerender;
    } else {
      this._prerender = JSON.parse(this.classroom.initialSceneJson);
    }

    // TODO: check json is valid

    this._eScene = this.populateScene(this._prerender, this._eConfigGui, this._eParams, this._eMeshTrackers, this._eCamera);

    this._eScene.background = new THREE.Color( 0x25274d );

    //* Camera
    if (!this._eCamera) {
      // No camera found on scene
      this._eCamera = this._cameraFactory.createPerspectiveCamera(this.eCanvas);
    }

    const farClippingPane = this._cameraFactory.getFarClippingPane(this._eCamera);
    this._datGuiHelper.addCameraFolder(this._eConfigGui, this._eCamera, farClippingPane);

    this._eConfigGui.close();

    // Controls
    this._eControls = this.createControls(this._eCamera, this.eCanvas);
  }

  //#endregion Scene Handlers

  //#region Control Handlers

  private createControls(camera: THREE.Camera, canvas: HTMLCanvasElement): OrbitControls {
    let controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    return controls;
  }

  //#endregion Control Handlers

  

  //#region Event Listeners

  private sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {

    // // Update sizes
    // sizes.width = event.target.innerWidth;
    // sizes.height = event.target.innerHeight;

    // // Update camera
    // this.camera.aspect = sizes.width / sizes.height;
    // this.camera.updateProjectionMatrix();

    // // Update renderer
    // this.renderer.setSize(sizes.width, sizes.height);
    // this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  // https://www.digitalocean.com/community/tutorials/angular-binding-keyup-keydown-events
  @HostListener('window:keydown.control', ['$event'])
  KeyDownCtrl(event: KeyboardEvent) {
    
  }

  @HostListener('window:mousemove', ['$event'])
  MouseMoved(event: MouseEvent) {
    this._mouseTracker.x = event.clientX / this.sizes.width * 2 - 1;
    this._mouseTracker.y = - (event.clientY / this.sizes.height) * 2 + 1;

    if (this.objectMovementEnabled) {
      this.setPickPosition(event);
    }
  }

  @HostListener('window:mouseout', ['$event'])
  MouseOut(event: MouseEvent) {

    if (this.objectMovementEnabled) {
      this.clearPickPosition();
    }
    
  }

  @HostListener('window:mouseleave', ['$event'])
  MouseLeft(event: MouseEvent) {

    if (this.objectMovementEnabled) {
      this.clearPickPosition();
    }
  }

  @HostListener('window:click', ['$event'])
  Clicked(event: MouseEvent) {

    // if (this.objectMovementEnabled) {
    //   this.setPickPosition(event);

    //   if (event.shiftKey) {
    //     this._pickerHelper.pick(this.pickPosition, this._gScene, this._gCamera);
    //   } else {      
    //     // this._pickerHelper.pickSingle(this.pickPosition, this._gScene, this._gCamera);
    //     this._pickerHelper.pickExperimental(this.pickPosition, this._gScene, this._gCamera);
    //   }
    //   return;
    // }

    let picked = this._pickerHelper.pickSingle(this.pickPosition, this._gScene, this._gCamera);

    if (picked && picked.object) {
      const me = this._gBodyTrackers.find(p => p.mesh.uuid === picked.object.uuid);

      const clicks = this._eventsMap.clicks;
      clicks.forEach(click => {
        if (me) {
          console.log(`MESH EMPHEMERAL PAIR FOUND ${me.mesh.uuid}`);
          this._commandPrototypeRegistry.perform(click.command, me.mesh, click.args);
          // this._commandPrototypeRegistry.performToBody(click.command, me.body, click.args);
        } else {
          console.log(`MESH EMPHEMERAL PAIR NOT FOUND ${JSON.stringify(picked.object)}`);
          this._commandPrototypeRegistry.perform(click.command, picked.object, click.args);
        }
        
        // const mesh = this._gMeshTrackers.find(m => m.uuid === click.subjectUuid);
        // if (mesh) {
        //   this._commandPrototypeRegistry.perform(click.command, mesh, click.args);
        // } else {
        //   console.log(`MESH NOT FOUND ${click.subjectUuid}`);
        // }
      });
    }
  }

  private extractUuidFromIntersectedObject(object: any): string {
    if (!object || !object.uuid) return;

    return object.uuid;
  }

  private addOrRemoveFromSelectedObjects(object: any) {
    const uuid = this.extractUuidFromIntersectedObject(object);
    const foundIndex = this._gSelectedMeshUuids.findIndex(selectedUuid => selectedUuid === uuid);
    if (foundIndex > 0) {
      // remove
      this._gSelectedMeshUuids.splice(foundIndex, 1);
      object.material.wireframe = false;
      console.log(`REMOVED ${uuid}`);
    } else {
      // add
      this._gSelectedMeshUuids.push(uuid);
      object.material.wireframe = true;
      console.log(`ADDED ${uuid}`);
    }
  }

  private updateHighlight(material) {
    // debugger;
    this._materialFactory.highlight(material);
  }

  pickPosition: THREE.Vector2 = new THREE.Vector2( 0, 0);
  getCanvasRelativePosition(event) {
    const rect = this.gCanvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  setPickPosition(event) {
    const pos = this.getCanvasRelativePosition(event);
    this.pickPosition.x = (pos.x / this.gCanvas.clientWidth ) *  2 - 1;
    this.pickPosition.y = (pos.y / this.gCanvas.clientHeight) * -2 + 1;  // note we flip Y
  }

  clearPickPosition() {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    this.pickPosition.x = -100000;
    this.pickPosition.y = -100000;
  }

  private disableObjectInteractions() {
    this.clearPickPosition();

    this.objectMovementEnabled = false;
    this.objectRotationEnabled = false;
  }

  public toggleEnableObjectMovement(): void {
    if (this.objectMovementEnabled) {
      this.objectMovementEnabled = false;
    } else {
      this.disableObjectInteractions();
      this.objectMovementEnabled = true;
    }
  }

  public objectRotationEnabled: boolean = false;
  public toggleEnableObjectRotation(): void {
    if (this.objectRotationEnabled) {
      this.objectRotationEnabled = false;
    } else {
      this.disableObjectInteractions();
      this.objectRotationEnabled = true;
    }
  }
    

  //#endregion Event Listeners

  //#region Event Functions

  private _hitSound = new Audio('../../assets/sounds/hit.mp3');

  private playHitSound = (collision) =>
  {
      const impactStrength = collision.contact.getImpactVelocityAlongNormal();

      if(impactStrength > 1.5)
      {
          this._hitSound.volume = Math.random();
          this._hitSound.currentTime = 0;
          this._hitSound.play();
      }
  }

  //#endregion Event Functions  

  //#region Prototype Creator Functions

  // private get _eventsMap() {
  //   return {
  //     collide: this.playHitSound
  //   };
  // };

  private get _physicalBodyOptions() {
    return {
      position: this._randomPosition(),
      scale: {
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
      },
      bodyMaterial: this.defaultMaterial,
    };
  }

  public dropBox() {
    const options: any = {...this._physicalBodyOptions};
    options.type = PhysicalBodyTypes.Box;

    this._physicsEngine.manifestPhysicalObject(options, this._gScene, this._eventsMap, this.world, this._gBodyTrackers);
  }

  public dropSphere() {
    const options: any = {...this._physicalBodyOptions};
    options.type = PhysicalBodyTypes.Sphere;

    this._physicsEngine.manifestPhysicalObject(options, this._gScene, this._eventsMap, this.world, this._gBodyTrackers);
  }

  public dropCylinder() {
    const options: any = {...this._physicalBodyOptions};
    options.type = PhysicalBodyTypes.Cylinder;

    this._physicsEngine.manifestPhysicalObject(options, this._gScene, this._eventsMap, this.world, this._gBodyTrackers);
  }

  public dropCone() {
    const options: any = {...this._physicalBodyOptions};
    options.type = PhysicalBodyTypes.Cone;

    this._physicsEngine.manifestPhysicalObject(options, this._gScene, this._eventsMap, this.world, this._gBodyTrackers);
  }

  public dropTorus() {
    const options: any = {...this._physicalBodyOptions};
    options.type = PhysicalBodyTypes.Torus;

    this._physicsEngine.manifestPhysicalObject(options, this._gScene, this._eventsMap, this.world, this._gBodyTrackers);
  }

  //#endregion Prototypte Creator Functions

  //#region Utilities

private _randomPosition(): THREE.Vector3 {
  return new THREE.Vector3((Math.random() - 0.5) * 3, 3, (Math.random() - 0.5) * 3);
}

private _randomRadius(): number {
  return Math.random() * 0.5;
}

//#endregion Utilities




  /**
 * Physics
 */
world = new CANNON.World()
private initWorld() {
  this.world.broadphase = new CANNON.SAPBroadphase(this.world)
  this.world.allowSleep = true
  this.world.gravity.set(0, - 9.82, 0)
}

// Default material
defaultMaterial = new CANNON.Material('default');
private initMaterial() {
  const defaultContactMaterial = new CANNON.ContactMaterial(
      this.defaultMaterial,
      this.defaultMaterial,
      {
          friction: 0.1,
          restitution: 0.7
      }
  )
  this.world.defaultContactMaterial = defaultContactMaterial;
}

// Floor
floorShape = new CANNON.Plane()
floorBody = new CANNON.Body()
private initFloor() {
  this.floorBody.mass = 0
  this.floorBody.addShape(this.floorShape)
  this.floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5) 
  this.world.addBody(this.floorBody)
}

 

 
 
 /**
  * Floor
  */
 floor: THREE.Mesh;
 private setupFloor() {
  const geometry = this._prototypeRegistry.planeGeometry;
  const material = this._prototypeRegistry.darkConcreteMaterial;
  material.visible = true;

  this.floor = new THREE.Mesh(geometry, material);
  this.floor.receiveShadow = true
  this.floor.rotation.x = - Math.PI * 0.5
  this._gScene.add(this.floor)
 }
 
 /**
  * Lights
  */
 ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
 private addAmbientLight() {
  this._gScene.add(this.ambientLight)
 }
 
 directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
 private setupLight() {
  this.directionalLight.castShadow = true
  this.directionalLight.shadow.mapSize.set(1024, 1024)
  this.directionalLight.shadow.camera.far = 15
  this.directionalLight.shadow.camera.left = - 7
  this.directionalLight.shadow.camera.top = 7
  this.directionalLight.shadow.camera.right = 7
  this.directionalLight.shadow.camera.bottom = - 7
  this.directionalLight.position.set(5, 5, 5)
  this._gScene.add(this.directionalLight)
 }

 


}
 

/* Mobile Events
window.addEventListener('touchstart', (event) => {
  // prevent the window from scrolling
  event.preventDefault();
  setPickPosition(event.touches[0]);
}, {passive: false});
 
window.addEventListener('touchmove', (event) => {
  setPickPosition(event.touches[0]);
});
 
window.addEventListener('touchend', clearPickPosition);
*/