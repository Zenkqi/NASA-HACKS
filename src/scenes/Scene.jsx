import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import SolarSystem from './SolarSystem';
import CameraAnimation from './CameraAnimation';
import InfoBox from './InfoBox';
import SideBar from './SideBar.jsx';

const Scene = () => {
  const [selectedObject, setSelectedObject] = useState(null);
  const controlsRef = useRef();

  return (
    <div
      style={{
        position: 'fixed',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'black',
      }}
    >
<SideBar/>

      <Canvas
        camera={{ position: [0, 2.5, 4], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        
        <ambientLight />
        <directionalLight position={[0, 1, 0]} intensity={1} color={0x0099ff} />
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.1}
          rotateSpeed={0.7}
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
        />
        <Suspense fallback={null}>
          <SolarSystem setSelectedObject={setSelectedObject} />
        </Suspense>
        <CameraAnimation
          selectedObject={selectedObject}
          setSelectedObject={setSelectedObject}
          controlsRef={controlsRef}
        />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      </Canvas>
      

      {/* Infobox */}
      {selectedObject && (
        <InfoBox selectedObject={selectedObject} setSelectedObject={setSelectedObject} />
      )}
    </div>
  );
};

export default Scene;