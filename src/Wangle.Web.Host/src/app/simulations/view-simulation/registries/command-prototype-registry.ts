import * as THREE from 'three';
import * as CANNON from 'cannon';

// TODO: This is duplicated - fix
interface MeshBody {
    mesh: THREE.Mesh;
    body: CANNON.Body;
  }

export class CommandPrototypeRegistry {

    constructor () {}

    public prototypeRotation(subject: THREE.Object3D, rotation: THREE.Vector3) {
        return function() {
            let current = subject.rotation.clone();
            current.x += rotation.x;
            current.y += rotation.y;
            current.z += rotation.z;
            return subject.rotation.copy(current);
        };
    }

    public prototypeScale(subject: THREE.Object3D, scale: THREE.Vector3) {
        return function() { 
            const current = subject.scale.clone();
            return subject.scale.addVectors(current, scale);
        };
    }

    public prototypeTranslate(subject: THREE.Object3D, position: THREE.Vector3) {
        return function() { 
            const current = subject.position.clone();
            return subject.position.addVectors(current, position);
        };
    }

    // Doesn't work anyhow
    public prototypeTranslateToBody(pair: MeshBody, position: THREE.Vector3) {
        return function() {
            if (!pair || !pair.body) {
                return;
            } 

            let current = {...pair.body.position, ...position};
            return pair.mesh.position.copy(current);
        };
    }

    // Doesn't work anyhow
    public performToBody(commandName: string, subject: MeshBody, args: any[]) {
        let arg = undefined;

        switch (commandName) {

            case 'translate':
                if (!args || args.length < 1) {
                    throw Error('Cannot translate without arguments');
                }

                arg = args[0];

                if (arg.isVector3) {
                    const p = (arg as THREE.Vector3);
                    this.prototypeTranslateToBody(subject, p)();

                    return;
                } else {
                    throw Error('Unable to translate - argument received is not a Vector3.');
                }
            default:
                return;
        }
    }

    public perform(commandName: string, subject: THREE.Object3D, args: any[]) {
        let arg = undefined;

        switch (commandName) {
            case 'rotate':
                if (!args || args.length < 1) {
                    throw Error('Cannot rotate without arguments');
                }

                arg = args[0];

                if (arg.isVector3) {
                    const a = (arg as THREE.Vector3);
                    this.prototypeRotation(subject, a)();

                    return;
                } else {
                    throw Error('Unable to rotate - argument received is not a Vector3.');
                }

            case 'scale':
                if (!args || args.length < 1) {
                    throw Error('Cannot scale without arguments');
                }

                arg = args[0];

                if (arg.isVector3) {
                    const s = (arg as THREE.Vector3);
                    let f = this.prototypeScale(subject, s);
                    f();

                    return;
                } else {
                    throw Error('Unable to scale - argument received is not a Vector3.');
                }

                case 'translate':
                if (!args || args.length < 1) {
                    throw Error('Cannot translate without arguments');
                }

                arg = args[0];

                if (arg.isVector3) {
                    const p = (arg as THREE.Vector3);
                    this.prototypeTranslate(subject, p)();

                    return;
                } else {
                    throw Error('Unable to translate - argument received is not a Vector3.');
                }
            default:
                return;
        }
    }
}