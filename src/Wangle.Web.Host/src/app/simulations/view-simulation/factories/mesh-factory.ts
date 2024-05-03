import * as THREE from 'three';

const TYPE = "Mesh";

// TODO: 
// When creating factories in TypeScript using generics, 
// it is necessary to refer to class types by their constructor functions. 
// So instead of using type:T, use type: { new(): T;}.

// function create<T>(c: {new(): T; }): T {
//     return new c();
// }

export class MeshFactory {

    constructor() {

    }

    casts = {
        "Mesh": THREE.Mesh,
    };

    isMesh(object: any): boolean {
        return object && object.isMesh;
    }

    castOut(object: any) : any {
        if (object.isMesh) {

            const type = this.casts[object.type];
            return (object as typeof type);
        }

        throw Error(`Cannot cast a ${TYPE} from a non-${TYPE} type`);
    }
}