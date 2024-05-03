import * as dat from 'lil-gui';
import gsap from 'gsap';
import * as THREE from 'three';

export class DatGuiHelper {

    constructor() {

    }

    public createConfigPanel(panelDiv: HTMLDivElement): dat.GUI {
        return new dat.GUI({
          width: 400,
          container: panelDiv,
        });
    }

    public createPalette(panelDiv: HTMLDivElement): dat.GUI {
      return new dat.GUI({
        width: 400,
        container: panelDiv,
      });
    }

    public addCameraFolder(gui: dat.GUI, camera: THREE.Camera, farClippingPane: number) {
      const gCameraFolder = gui.addFolder('Camera');
      gCameraFolder.add(camera.position, 'x', 0, farClippingPane);
      gCameraFolder.add(camera.position, 'y', 0, farClippingPane);
      gCameraFolder.add(camera.position, 'z', 0, farClippingPane);
      gCameraFolder.close();
    }

    public addMeshConfiguration(gui: dat.GUI, meshName: string, mesh: any, farClippingPane: number) {
        if (!mesh.isMesh) {
            // In the pursuit of a generic solution the 'any' type is currently used on the mesh paramter.
            // This check is then necessary to prevent issues that type-matching would prevent inherently.
            throw `Cannot add Mesh configuraiton for an object that is not of type THREE.Mesh.`;
        }
        
        const folder = gui.addFolder(`${meshName}`);

        const material = mesh.material;
  
        const params = {
          spin: () =>
          {
              gsap.to(mesh.rotation, 1, { y: mesh.rotation.y + Math.PI * 2 })
          },
          get wireframe(){ return material.wireframe; },
          set wireframe(value){
            material.wireframe = value;
          },
          get visible(){ return mesh.visible; },
          set visible(value){
            mesh.visible = value;
          },
          get positionX(){ return mesh.position.x; },
          set positionX(value){
            mesh.position.x = value;
          },
          get positionY(){ return mesh.position.y; },
          set positionY(value){
            mesh.position.y = value;
          },
          get positionZ(){ return mesh.position.z; },
          set positionZ(value){
            mesh.position.z = value;
          },
          get rotationX(){ return mesh.rotation.x; },
          set rotationX(value){
            mesh.rotation.x = value;
          },
          get rotationY(){ return mesh.rotation.y; },
          set rotationY(value){
            mesh.rotation.y = value;
          },
          get rotationZ(){ return mesh.rotation.z; },
          set rotationZ(value){
            mesh.rotation.z = value;
          },
        }   
  
        folder.add(params, 'visible');
        folder.add(params, 'wireframe');
        folder.add(params, 'spin');        
  
        folder.add(params, 'positionX', -3, 3, 0.01).name('pan');
        folder.add(params, 'positionY', -3, 3, 0.01).name('elevation');
        folder.add(params, 'positionZ', 0, farClippingPane, 10).name('nearness');
        
        folder.add(params, 'rotationX', 0, Math.PI * 2);
        folder.add(params, 'rotationY', 0, Math.PI * 2);
        folder.add(params, 'rotationZ', 0, Math.PI * 2);
        folder.close();

        return params;
    }
}