import * as THREE from 'three';

const TYPE = "Material";

export class MaterialFactory {

    constructor() {

    }

    casts = {
        "MeshBasicMaterial": THREE.MeshBasicMaterial,
        "MeshStandardMaterial": THREE.MeshStandardMaterial,
    };

    castOut(object: any) : THREE.Mesh {
        if (object.isMaterial) {

            const type = this.casts[object.type];
            return (object as typeof type);
        }

        throw `Cannot cast a ${TYPE} from a non-${TYPE} type`;
    }

    highlight(object: any) {
        if (object.isMaterial) {

            const type = this.casts[object.type];
            let material = (object as typeof type);

            switch (typeof material) {
                case THREE.MeshBasicMaterial.toString():
                    material.wireframe = !material.wireframe;
                    return;
                case THREE.MeshStandardMaterial.toString():
                    material.wireframe = !material.wireframe;
                    return;
                default:
                    return;
            }
        }
    }
}