import * as THREE from 'three';

const TYPE = "Camera";

const FIELD_OF_VIEW = 1;
const NEAR_CLIPPING_PANE = 1;
const FAR_CLIPPING_PANE = 1000;

const POSITION_Z = 400;

const PERSPECTIVE_CAMERA = 'PerspectiveCamera';

export class CameraFactory {

    constructor() {

    }

    types = {
        PERSPECTIVE_CAMERA: PERSPECTIVE_CAMERA,
    };

    casts = {
        PERSPECTIVE_CAMERA: THREE.PerspectiveCamera,
    };

    public isCamera(object: any): boolean {
        return object && object.isCamera;
    }

    private _isCameraOfType(camera: THREE.Camera, type: string) {
        return camera && camera.type === type;
    }

    //#region Extractions

    public castOut(object: any) : THREE.Camera {
        if (object.isCamera) {

            const type = this.casts[object.type];
            return (object as typeof type);
        }

        throw `Cannot cast a ${TYPE} from a non-${TYPE} type`;
    }

    public getFarClippingPane(camera: THREE.Camera): number {
        if (!camera) {
            throw Error(`Unable to extract far clipping pane value - camera is ${camera}`);
        }

        if (this._isCameraOfType(camera, this.types.PERSPECTIVE_CAMERA)) {
            const type = this.casts[camera.type];
            const castedCamera = (camera as typeof type);

            return castedCamera.far;
        }

        throw Error(`Camera type is unrecognised, or does not have a far clipping pane value. Type: ${camera.type}`);
    }

    //#endregion Extractions

    //#region Create Cameras

    public createPerspectiveCamera(canvas: HTMLCanvasElement): THREE.PerspectiveCamera {
        const aspectRatio = this.getAspectRatio(canvas);
        let camera = new THREE.PerspectiveCamera(FIELD_OF_VIEW, aspectRatio, NEAR_CLIPPING_PANE, FAR_CLIPPING_PANE);
    
        camera.position.z = POSITION_Z;
        return camera;
    }

    // #endregion Create Cameras

    //#region Utilities

    private getAspectRatio(canvas: HTMLCanvasElement) {
        return canvas.clientWidth / canvas.clientHeight;
    }

    //#endregion Utilities
}