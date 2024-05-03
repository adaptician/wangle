import * as THREE from 'three';

export class PrototypeRegistry {

    //#region Textures

    private _cubeTextureLoader = new THREE.CubeTextureLoader();
    private _concreteCubeMapTexture = this._cubeTextureLoader.load([
        '../../../assets/textures/environmentMaps/0/px.png',
        '../../../assets/textures/environmentMaps/0/nx.png',
        '../../../assets/textures/environmentMaps/0/py.png',
        '../../../assets/textures/environmentMaps/0/ny.png',
        '../../../assets/textures/environmentMaps/0/pz.png',
        '../../../assets/textures/environmentMaps/0/nz.png'
    ]);

    // #endregion Textures

    // #region Materials

    private _concreteMaterial1 = new THREE.MeshStandardMaterial({
        color: '#aaabb8',
        metalness: 0.3,
        roughness: 0.4,
        // envMap: this._concreteCubeMapTexture,
        // envMapIntensity: 0.5
    });
    private _concreteMaterial2 = new THREE.MeshStandardMaterial({
        color: '#2e9cca',
        metalness: 0.3,
        roughness: 0.4,
        // envMap: this._concreteCubeMapTexture,
        // envMapIntensity: 0.5
    });
    private _concreteMaterial3 = new THREE.MeshStandardMaterial({
        color: '#29648a',
        metalness: 0.3,
        roughness: 0.4,
        // envMap: this._concreteCubeMapTexture,
        // envMapIntensity: 0.5
    });
    public get concreteMaterial() {
        const choice = Math.random() * 10
        // console.log(`CHOICE ${choice}`)
        if (choice > 3 && choice < 6) {
            return this._concreteMaterial1.clone();
        } else if (choice > 6) {
            return this._concreteMaterial2.clone();
        } else {
            return this._concreteMaterial3.clone();
        }
        
    }

    private _darkConcreteMaterial = new THREE.MeshStandardMaterial({
        color: '#464866',
        metalness: 0.3,
        roughness: 0.4,
        // envMap: this._concreteCubeMapTexture,
        // envMapIntensity: 0.5
    });
    public get darkConcreteMaterial() {
        return this._darkConcreteMaterial.clone();
        // return this.concreteMaterial
    }

    // #endregion Materials

    // #region Geometries

    private _planeGeometry = new THREE.PlaneGeometry(10, 10);
    public get planeGeometry(): THREE.PlaneGeometry {
        return (this._planeGeometry.clone() as THREE.PlaneGeometry);
    }

    private _circleGeometry = new THREE.CircleGeometry(5, 32)
    public get circleGeometry(): THREE.CircleGeometry {
        return (this._circleGeometry.clone() as THREE.CircleGeometry);
    }

    private _sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
    public get sphereGeometry(): THREE.SphereGeometry {
        return (this._sphereGeometry.clone() as THREE.SphereGeometry);
    }

    private _boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    public get boxGeometry(): THREE.BoxGeometry {
        return (this._boxGeometry.clone() as THREE.BoxGeometry);
    }

    private _cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 20);
    public get cylinderGeometry(): THREE.CylinderGeometry {
        return (this._cylinderGeometry.clone() as THREE.CylinderGeometry);
    }

    private _torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 60);
    public get torusGeometry(): THREE.TorusGeometry {
        return (this._torusGeometry.clone() as THREE.TorusGeometry);
    }

    private _coneGeometry = new THREE.ConeGeometry(1, 2, 32);
    public get coneGeometry(): THREE.ConeGeometry {
        return (this._coneGeometry.clone() as THREE.ConeGeometry);
    }
    

    // #endregion Geometries
    

    constructor () {

    }
}