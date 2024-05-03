import * as THREE from 'three';

/* Reference:
https://r105.threejsfundamentals.org/threejs/lessons/threejs-picking.html
*/

class PickedObject {
  object: THREE.Object3D;
  // savedColor: any;
}

export class PickerHelper {
    private _raycaster: THREE.Raycaster;
    private _pickedObject: any;
    private _previousPickPosition: THREE.Vector2 = new THREE.Vector2();
    private _pickedObjects: PickedObject[];

    private _axesHelper: THREE.AxesHelper;
    private _axesController: THREE.Group;

    private _xUuid: string;
    private _yUuid: string;
    private _zUuid: string;
    
    constructor() {
        this._raycaster = new THREE.Raycaster();
        this._pickedObjects = null;

        // this._axesController = this.createAxesController();
        this._axesHelper = new THREE.AxesHelper();
    }

    private createAxesController(): THREE.Group {
      const cylinderProto = new THREE.CylinderGeometry(0.1, 0.1, 2, 5);

      const x = new THREE.Mesh(cylinderProto, new THREE.MeshStandardMaterial({ color: '#eb3a34' })); // red
      const y = new THREE.Mesh(cylinderProto, new THREE.MeshStandardMaterial({ color: '#34eb3a' })); // green
      const z = new THREE.Mesh(cylinderProto, new THREE.MeshStandardMaterial({ color: '#3443eb' })); // blue

      this._xUuid = x.uuid;
      this._yUuid = y.uuid;
      this._zUuid = z.uuid;

      const xAxis = new THREE.Vector3(1, 0, 0);
      const yAxis = new THREE.Vector3(0, 1, 0);
      const zAxis = new THREE.Vector3(0, 0, 1);

      const ninetyDegrees = Math.PI / 2;

      x.rotateOnAxis(zAxis.normalize(), ninetyDegrees);
      z.rotateOnAxis(xAxis.normalize(), ninetyDegrees);

      const group = new THREE.Group();
      group.add(x);
      group.add(y);
      group.add(z);

      return group;
    }

    addHelpers(scene) {
      scene.add(this._axesController);
      // scene.add(this._axesHelper);
    }

    getCenterPoint(mesh) {
      const isMesh = mesh instanceof THREE.Mesh || mesh.isMesh;
      if (!isMesh) return undefined;

      const geometry = mesh.geometry;
      
      geometry.computeBoundingBox();
      var center = new THREE.Vector3();
      geometry.boundingBox.getCenter( center );
      mesh.localToWorld( center );
      return center;
  }

    pickExperimental(normalizedPosition: THREE.Vector2, scene, camera) {
      // cast a ray through the frustum
      this._raycaster.setFromCamera(normalizedPosition, camera);

      // get the list of objects the ray intersected
      const intersectedObjects = this._raycaster.intersectObjects(scene.children);
      if (intersectedObjects.length) {
        // pick the first object. It's the closest one
        let intersectedObject: any = intersectedObjects[0].object;
        const intersectedUuid = intersectedObject.uuid;

        const center = this.getCenterPoint(intersectedObject);
        console.log(`CENTER ${JSON.stringify(center.x)}`);

        switch(intersectedUuid) {
          case this._xUuid:
            console.log(`X AXIS CLICKED`);

            // console.log(`PREV ${this._previousPickPosition && JSON.stringify(this._previousPickPosition.x)}`);
            
            intersectedObject.geometry.computeBoundingBox();
            var middle = new THREE.Vector3();
            intersectedObject.geometry.boundingBox.getCenter( middle );
            console.log(`MIDDLE ${JSON.stringify(middle.x)}`);

            let step = 0.2;
            if (normalizedPosition.x < middle.x) {
              step = -step;
            }

            
            console.log(`POS ${JSON.stringify(normalizedPosition.x)}`);
            
            this._pickedObject.object.position.x += step;
            this._axesController.position.x += step;

            this._previousPickPosition = normalizedPosition.clone();
            break;
          case this._yUuid:
            console.log(`Y AXIS CLICKED`);
            break;
          case this._zUuid:
            console.log(`Z AXIS CLICKED`);
            break;
          default:
            // restore the color if there is a picked object
            if (this._pickedObjects && this._pickedObjects.length > 0) {
              this._pickedObject = undefined;
              this._previousPickPosition = undefined;
              // this._pickedObjects.forEach(pickedObject => {
              //   pickedObject.object.material.color.setHex(pickedObject.savedColor);
              //   pickedObject.object.material.wireframe = false;
              // });
            }
            this._pickedObjects = [];

            const color = intersectedObject.material.color.getHex();

            intersectedObject.material.wireframe = true;

            let pickedObject: PickedObject = {
              object: intersectedObject,
              // savedColor: color,
            };

            this._pickedObject = pickedObject;
            this._pickedObjects.push(pickedObject);

            
            if (center) {
              this._axesController.position.copy(center);
              this._axesController.scale.copy(new THREE.Vector3(intersectedObject.scale.x * 2, intersectedObject.scale.y * 2, intersectedObject.scale.z * 2));
            }

            break;
        }
      }
    }

    pickSingle(normalizedPosition, scene, camera) {
      
      if (!scene || !camera) { 
        return 
      }

      // restore the color if there is a picked object
      // if (this._pickedObjects && this._pickedObjects.length > 0) {
      //   this._pickedObjects.forEach(pickedObject => {
      //     pickedObject.object.material.color.setHex(pickedObject.savedColor);
      //     pickedObject.object.material.wireframe = false;
      //   });
      // }
      this._pickedObjects = [];
    
      const picked = this.pick(normalizedPosition, scene, camera);
      return picked;

      // scene.add(this._axesController);
      // scene.add(this._axesHelper);
    }

    // TODO: use this for creating an event
    pickSingleSelect(normalizedPosition, scene, camera) {
      

      // restore the color if there is a picked object
      if (this._pickedObjects && this._pickedObjects.length > 0) {
        // this._pickedObjects.forEach(pickedObject => {
        //   pickedObject.object.material.color.setHex(pickedObject.savedColor);
        //   pickedObject.object.material.wireframe = false;
        // });
      }
      this._pickedObjects = [];
    
      this.pick(normalizedPosition, scene, camera);
    }

    pick(normalizedPosition, scene, camera) {

      // cast a ray through the frustum
      this._raycaster.setFromCamera(normalizedPosition, camera);

      // get the list of objects the ray intersected
      const intersectedObjects = this._raycaster.intersectObjects(scene.children);
      if (intersectedObjects.length) {
        // pick the first object. It's the closest one
        let intersectedObject: any = intersectedObjects[0].object;
        // const color = intersectedObject.material.color.getHex();

        // set its emissive color to flashing red/yellow
        // this._pickedObject.material.color.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
        // intersectedObject.material.wireframe = true;

        let pickedObject: PickedObject = {
          object: intersectedObject,
          // savedColor: color,
        };

        this._pickedObjects.push(pickedObject);

        return pickedObject;
      }
    }
}