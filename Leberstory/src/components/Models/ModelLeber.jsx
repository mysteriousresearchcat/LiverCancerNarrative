import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { Model as Leberneu } from "@/components/Leberneu";

const RotatingLeber = ({ isMobile, isTablet, shouldRotate }) => {
  const groupRef = useRef(null);

  useFrame(() => {
    if (shouldRotate && groupRef.current) groupRef.current.rotation.y += 0.003;
  });

  return (
    <group
      ref={groupRef}
      scale={isMobile ? 0.012 : isTablet ? 0.016 : 0.02}
      position={[0, 0, 0]}
      rotation={[0, -Math.PI / 4, 0]}
    >
      <Leberneu />
    </group>
  );
};

const ModelLeber = ({ autoRotate = true, onInteractionStart, onInteractionEnd }) => {
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
<Canvas camera={{ position: [1, 1, 6], fov: 50 }}>
  {/* Soft base light */}
  <ambientLight intensity={0.6} color="#1a1a40" />

  {/* Key light */}
  <directionalLight
    position={[5, 5, 5]}
    intensity={2}
  />

  {/* Fill light (opposite side) */}
  <directionalLight
    position={[-5, -5, -5]}
    intensity={2}
  />

  <OrbitControls
    enabled
    enablePan={false}
    enableZoom={false}
    maxDistance={20}
    minDistance={5}
    minPolarAngle={Math.PI / 4.2}
    maxPolarAngle={Math.PI / 1.7}
    onStart={onInteractionStart}
    onEnd={onInteractionEnd}
  />

  <RotatingLeber
    isMobile={isMobile}
    isTablet={isTablet}
    shouldRotate={autoRotate}
  />
</Canvas>

  )
}   

export default ModelLeber;
