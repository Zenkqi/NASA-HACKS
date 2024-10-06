import * as THREE from 'three';

const loader = new GLTFLoader();
loader.load(
    '../assets/Rocket/saturn_v_-_nasa/scene.gltf',
    ( gltf ) => {
        // called when the resource is loaded
        scene.add( gltf.scene );
        
    },
    ( xhr ) => {
        // called while loading is progressing
        console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
    },
    ( error ) => {
        // called when loading has errors
        console.error( 'An error happened', error );
    },
);