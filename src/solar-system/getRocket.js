// import * as THREE from 'three';

// import React, { useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// // Load the GLTF model for the rocket

// const loader = new THREE.GLTFLoader();
// let rocketModel;

// loader.load('../assets/Rocket/saturn_v_-_nasa/scene.gltf', (gltf) => {
//     rocketModel = gltf.scene;
//     // Customize the rocket's initial position, scale, and rotation here
//     rocketModel.position.set(0, 0, 0);
//     rocketModel.scale.set(0.1, 0.1, 0.1);
//     rocketModel.rotation.set(0, Math.PI / 2, 0);
// });

// // Create a function to create instances of the rocket
// function createRocketInstance() {
//     if (!rocketModel) {
//         console.error('Rocket model not loaded yet.');
//         return null;
//     }

//     const rocketInstance = rocketModel.clone();
//     // Customize each instance's position, scale, and rotation as needed
//     // For example:
//     // rocketInstance.position.set(x, y, z);
//     // rocketInstance.scale.set(sx, sy, sz);
//     // rocketInstance.rotation.set(rx, ry, rz);

//     return rocketInstance;
// }

// export default getRocket;
