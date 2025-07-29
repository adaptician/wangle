import * as CANNON from 'cannon';
import * as THREE from 'three';

import { PrototypeRegistry } from "../registries/prototype-registry";

// TODO: check this resource - https://gist.github.com/duhaime/6a74b9603dc7700183d43a2485b02f0f

export const PhysicalBodyTypes = {
    Box: 'BOX',
    Sphere: 'SPHERE',
    Cylinder: 'CYLINDER',
    Torus: 'TORUS',
    Cone: 'CONE',
};

export const ThreeJsGemoetriesMap = {
    BoxGeometry: 'BOX',
    SphereGeometry: 'SPHERE',
    CylinderGeometry: 'CYLINDER',
    TorusGeometry: 'TORUS',
    ConeGeometry: 'CONE',
};

export interface PhysicalBodyOptions {
    position: THREE.Vector3;
    scale: THREE.Vector3;
    bodyMaterial: any; // CANNON Material
    uuid?: string; // THREE.JS Mesh uuid
}

export interface EventsMap {
    collide: Function;
}

export interface PhysicalObjectOptions extends PhysicalBodyOptions {
    type: string;
}

export interface PhysicalObject {
    mesh: THREE.Mesh;
    body: any; // CANNON.Body
}

export class CannonPhysicsEngine {

    private _prototypeRegistry: PrototypeRegistry;

    constructor () {
        this._prototypeRegistry = new PrototypeRegistry();
    }

    // #region Create Bodies

    private _createBody(mesh: THREE.Mesh, shape, options: PhysicalBodyOptions, scene: THREE.Scene, eventsMap: EventsMap, world, objectsToUpdate: PhysicalObject[]) {
        
        mesh.position.copy(options.position);
        mesh.castShadow = true;
        
        scene.add(mesh);
        
        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(0, 3, 0),
            shape: shape,
            material: options.bodyMaterial,
        })
        // No longer works
        // body.position.copy(options.position);
        body.position.x = mesh.position.x;
        body.position.y = mesh.position.y;
        body.position.z = mesh.position.z;

        // Events
        // TODO: use prop loop trick
        body.addEventListener('collide', eventsMap['collide']);

        // Add to World
        world.addBody(body);
    
        if (objectsToUpdate) {
            // Save in objects
            objectsToUpdate.push({ mesh, body });
        }
    }

    private _createBox (options: PhysicalBodyOptions, scene: THREE.Scene, eventsMap: EventsMap, world, objectsToUpdate: PhysicalObject[])
    {
        const geometry = this._prototypeRegistry.boxGeometry;
        const material = this._prototypeRegistry.concreteMaterial;

        // Three.js mesh
        const mesh = new THREE.Mesh(geometry, material);

        // Casting the mesh object breaks signalr - so we cast only a lightweight version.
        // We have to create a new Mesh, but the uuid's won't match. So we manually set it IF a uuid is present.
        if (options.uuid) {
            mesh.uuid = options.uuid;
        }

        mesh.scale.copy(options.scale);
    
        // Cannon.js body
        // Why alter the params? Won't the body be dis-similar to the rendered mesh??
        // const shape = new CANNON.Box(new CANNON.Vec3(options.scale.x * 0.5, options.scale.y * 0.5, options.scale.z * 0.5));
        const shape = new CANNON.Box(new CANNON.Vec3(geometry.parameters.width, geometry.parameters.height, geometry.parameters.depth));
    
        this._createBody(mesh, shape, options, scene, eventsMap, world, objectsToUpdate);
    }

    private _createSphere = (options: PhysicalBodyOptions, scene: THREE.Scene, eventsMap: EventsMap, world, objectsToUpdate: PhysicalObject[]) =>
    {
        const geometry = this._prototypeRegistry.sphereGeometry;
        const material = this._prototypeRegistry.concreteMaterial;

        // Three.js mesh
        const mesh = new THREE.Mesh(geometry, material);
        
        // Casting the mesh object breaks signalr - so we cast only a lightweight version.
        // We have to create a new Mesh, but the uuid's won't match. So we manually set it IF a uuid is present.
        if (options.uuid) {
            mesh.uuid = options.uuid;
        }

        mesh.scale.copy(options.scale);
    
        // Cannon.js body
        const shape = new CANNON.Sphere(geometry.parameters.radius);
    
        this._createBody(mesh, shape, options, scene, eventsMap, world, objectsToUpdate);        
    }

    private _createCylinder = (options: PhysicalBodyOptions, scene: THREE.Scene, eventsMap: EventsMap, world, objectsToUpdate: PhysicalObject[]) =>
    {
        const geometry = this._prototypeRegistry.cylinderGeometry;
        const material = this._prototypeRegistry.concreteMaterial;

        // Three.js mesh
        const mesh = new THREE.Mesh(geometry, material);
        
        // Casting the mesh object breaks signalr - so we cast only a lightweight version.
        // We have to create a new Mesh, but the uuid's won't match. So we manually set it IF a uuid is present.
        if (options.uuid) {
            mesh.uuid = options.uuid;
        }

        mesh.scale.copy(options.scale);
    
        // Cannon.js body
        // Seems Cylinder is busted - using surrogate
        // const shape = new CANNON.Cylinder(geometry.parameters.radiusTop, geometry.parameters.radiusBottom, geometry.parameters.height, geometry.parameters.heightSegments);
        const shape = new CANNON.Box(new CANNON.Vec3(geometry.parameters.radiusTop, geometry.parameters.height, geometry.parameters.radiusTop));
    
        this._createBody(mesh, shape, options, scene, eventsMap, world, objectsToUpdate);        
    }

    private _createTorus = (options: PhysicalBodyOptions, scene: THREE.Scene, eventsMap: EventsMap, world, objectsToUpdate: PhysicalObject[]) =>
    {
        const geometry = this._prototypeRegistry.torusGeometry;
        const material = this._prototypeRegistry.concreteMaterial;

        // Three.js mesh
        const mesh = new THREE.Mesh(geometry, material);
        
        // Casting the mesh object breaks signalr - so we cast only a lightweight version.
        // We have to create a new Mesh, but the uuid's won't match. So we manually set it IF a uuid is present.
        if (options.uuid) {
            mesh.uuid = options.uuid;
        }

        mesh.scale.copy(options.scale);
    
        // Cannon.js body
        // Cannon DOES NOT directly support torus, BUT we can create a surrogate.
        const shape = new CANNON.Sphere(geometry.parameters.radius);
    
        this._createBody(mesh, shape, options, scene, eventsMap, world, objectsToUpdate);        
    }

    private _createCone = (options: PhysicalBodyOptions, scene: THREE.Scene, eventsMap: EventsMap, world, objectsToUpdate: PhysicalObject[]) =>
    {
        const geometry = this._prototypeRegistry.coneGeometry;
        const material = this._prototypeRegistry.concreteMaterial;

        // Three.js mesh
        const mesh = new THREE.Mesh(geometry, material);
        
        // Casting the mesh object breaks signalr - so we cast only a lightweight version.
        // We have to create a new Mesh, but the uuid's won't match. So we manually set it IF a uuid is present.
        if (options.uuid) {
            mesh.uuid = options.uuid;
        }

        mesh.scale.copy(options.scale);
    
        // Cannon.js body
        // Seems Cylinder is busted - using surrogate
        // const shape = new CANNON.Cylinder(geometry.parameters.radiusTop, geometry.parameters.radiusBottom, geometry.parameters.height, geometry.parameters.heightSegments);
        const shape = new CANNON.Box(new CANNON.Vec3(geometry.parameters.radiusTop, geometry.parameters.height, geometry.parameters.radiusBottom));
    
        this._createBody(mesh, shape, options, scene, eventsMap, world, objectsToUpdate);        
    }

    public manifestPhysicalObject(options: PhysicalObjectOptions, scene: THREE.Scene, eventsMap: EventsMap, world, objectsToUpdate: PhysicalObject[]) {
        if (!options || !options.type) {
            throw Error(`Unable to manifest the object - invalid options or type: ${JSON.stringify(options)}`);
        }

        switch (options.type) {
            case PhysicalBodyTypes.Box:
                this._createBox(options, scene, eventsMap, world, objectsToUpdate);
                return;
            case PhysicalBodyTypes.Sphere:
                this._createSphere(options, scene, eventsMap, world, objectsToUpdate);
                return;
            case PhysicalBodyTypes.Cylinder:
                this._createCylinder(options, scene, eventsMap, world, objectsToUpdate);
                return;
            case PhysicalBodyTypes.Torus:
                this._createTorus(options, scene, eventsMap, world, objectsToUpdate);
                return;
            case PhysicalBodyTypes.Cone:
                this._createCone(options, scene, eventsMap, world, objectsToUpdate);
                return;
            default:
                throw Error(`Unable to manifest the object - unrecognised type: ${JSON.stringify(options.type)}`);
        }
    }

    // #region Create Bodies

    // #region Remove Bodies

    public removeBody(bodyObject, eventsMap: EventsMap, scene: THREE.Scene, world) {
        
        // Remove listeners
        bodyObject.body.removeEventListener('collide', eventsMap['collide']);
        
        // Remove body
        world.removeBody(bodyObject.body);

        // Remove mesh
        scene.remove(bodyObject.mesh);
    }

    // #endregion Remove Bodies
}