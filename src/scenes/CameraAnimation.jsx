// src/components/CameraAnimation.jsx

import { useFrame, useThree } from '@react-three/fiber';
import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

// Custom hook to get the previous value of a state
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const CameraAnimation = ({ selectedObject, setSelectedObject, controlsRef }) => {
  const { camera } = useThree();

  // Store positions for animations
  const zoomOutCameraPosition = useRef(camera.position.clone());
  const zoomOutTarget = useRef(
    controlsRef.current ? controlsRef.current.target.clone() : new THREE.Vector3()
  );

  // Animation state
  const [zoomState, setZoomState] = useState('idle'); // 'idle', 'zoomingIn', 'following', 'zoomingOut'
  const zoomProgress = useRef(0);
  const animationDuration = 1.0; // seconds
  const clock = useRef(new THREE.Clock());

  const prevSelectedObject = usePrevious(selectedObject);

  // Handle Escape key to reset the camera
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if ((zoomState === 'following' || zoomState === 'idle') && selectedObject) {
          setSelectedObject(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedObject, zoomState, setSelectedObject]);

  // Start zoom-in animation when an object is selected
  useEffect(() => {
    if (
      selectedObject &&
      prevSelectedObject !== selectedObject &&
      controlsRef.current &&
      zoomState === 'idle'
    ) {
      // Store the camera position and target before zoom-in
      zoomOutCameraPosition.current.copy(camera.position);
      zoomOutTarget.current.copy(controlsRef.current.target);

      // Start zoom-in animation
      setZoomState('zoomingIn');
      zoomProgress.current = 0;
      clock.current.start();

      // Disable controls during animation
      controlsRef.current.enabled = false;
    }
  }, [selectedObject, prevSelectedObject, zoomState, camera, controlsRef]);

  // Start zoom-out animation when selectedObject becomes null
  useEffect(() => {
    if (
      !selectedObject &&
      prevSelectedObject &&
      controlsRef.current &&
      (zoomState === 'following' || zoomState === 'idle')
    ) {
      // Start zoom-out animation
      setZoomState('zoomingOut');
      zoomProgress.current = 0;
      clock.current.start();

      // Disable controls during animation
      controlsRef.current.enabled = false;
    }
  }, [selectedObject, prevSelectedObject, zoomState, controlsRef]);

  useFrame(() => {
    const delta = clock.current.getDelta();

    if (zoomState === 'zoomingIn' || zoomState === 'following') {
      if (zoomState === 'zoomingIn') {
        zoomProgress.current += delta / animationDuration;

        if (zoomProgress.current >= 1) {
          zoomProgress.current = 1;
          setZoomState('following');
          // Keep controls disabled while zoomed in
          if (controlsRef.current) {
            controlsRef.current.enabled = false;
          }
        }
      }

      // Compute positions
      const sunPosition = new THREE.Vector3(0, 0, 0);
      const objectPosition = selectedObject.ref.current.getWorldPosition(new THREE.Vector3());

      // Compute vector from sun to object
      const sunToObject = objectPosition.clone().sub(sunPosition).normalize();

      // Use the up vector
      let upVector = new THREE.Vector3(0, 1, 0);

      // If sunToObject and upVector are parallel, choose another up vector
      if (Math.abs(sunToObject.dot(upVector)) === 1) {
        upVector = new THREE.Vector3(1, 0, 0);
      }

      // Compute a vector perpendicular to sunToObject
      const offsetDirection = new THREE.Vector3()
        .crossVectors(sunToObject, upVector)
        .normalize();

      // Desired camera offset distance from the object (closer zoom)
      const offsetDistance = 1.0; // Adjusted for closer zoom

      // Compute desired camera position
      const desiredPosition = objectPosition
        .clone()
        .add(offsetDirection.multiplyScalar(offsetDistance));

      // Shift the camera position upward to avoid asteroid belt
      desiredPosition.y += 0.5; // Adjust the value as needed

      // Shift the camera position to move the object towards the left of the screen
      desiredPosition.x += 0.5; // Adjust the value as needed

      // Interpolate camera position and target during zoomingIn
      if (zoomState === 'zoomingIn') {
        camera.position.lerpVectors(
          zoomOutCameraPosition.current,
          desiredPosition,
          zoomProgress.current
        );

        controlsRef.current.target.lerpVectors(
          zoomOutTarget.current,
          objectPosition,
          zoomProgress.current
        );
      } else {
        // In 'following' state, set camera position directly
        camera.position.copy(desiredPosition);
        controlsRef.current.target.copy(objectPosition);
      }

      camera.lookAt(objectPosition);
    } else if (zoomState === 'zoomingOut') {
      zoomProgress.current += delta / animationDuration;

      if (zoomProgress.current >= 1) {
        zoomProgress.current = 1;
        setZoomState('idle');

        // Re-enable controls after zoom-out
        if (controlsRef.current) {
          controlsRef.current.enabled = true;
          controlsRef.current.update();
        }
      }

      // Interpolate camera position and target
      const startObjectPosition = prevSelectedObject
        ? prevSelectedObject.ref.current.getWorldPosition(new THREE.Vector3())
        : new THREE.Vector3();

      // Compute starting camera position
      const sunPosition = new THREE.Vector3(0, 0, 0);
      const sunToObject = startObjectPosition.clone().sub(sunPosition).normalize();

      let upVector = new THREE.Vector3(0, 1, 0);
      if (Math.abs(sunToObject.dot(upVector)) === 1) {
        upVector = new THREE.Vector3(1, 0, 0);
      }
      const offsetDirection = new THREE.Vector3()
        .crossVectors(sunToObject, upVector)
        .normalize();
      const offsetDistance = 1.0; // Same as before
      const startPosition = startObjectPosition
        .clone()
        .add(offsetDirection.multiplyScalar(offsetDistance));

      // Apply the same upward and horizontal shifts
      startPosition.y += 0.5; // Same as before
      startPosition.x += 0.5; // Same as before

      camera.position.lerpVectors(
        startPosition,
        zoomOutCameraPosition.current,
        zoomProgress.current
      );

      controlsRef.current.target.lerpVectors(
        startObjectPosition,
        zoomOutTarget.current,
        zoomProgress.current
      );

      camera.lookAt(controlsRef.current.target);
    }
  });

  return null;
};

export default CameraAnimation;