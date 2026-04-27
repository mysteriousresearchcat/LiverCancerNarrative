import React, { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { Vector3 } from "three";
import { Model as Metastasen } from "@/components/Metastasen.jsx";
import { useLanguage } from "../Context/LanguageContext";

const METASTASEN_TOOLTIPS = [
  {
    id: "primary",
    anchor: [-60, 20, 0.4],
    lineEnd: [-125, 29, -0.32],
    label: [-125, 29, -0.32],
    labelSide: "right",
  },
  {
    id: "secondary",
    anchor: [38, 66, -0.4],
    lineEnd: [125, 29, 0.32],
    label: [125, 29, 0.32],
    labelSide: "left",
  },
];

const MetastasenTooltips = ({ isMobile, isTablet, text, modelGroupRef }) => {
  const textSize = isMobile ? "14px" : isTablet ? "16px" : "18px";
  const { camera } = useThree();
  const [activeTooltipId, setActiveTooltipId] = useState(METASTASEN_TOOLTIPS[0].id);

  useFrame(() => {
    if (!modelGroupRef.current) return;

    let nearestTooltipId = METASTASEN_TOOLTIPS[0].id;
    let nearestDistance = Number.POSITIVE_INFINITY;

    METASTASEN_TOOLTIPS.forEach((tip) => {
      const worldAnchor = modelGroupRef.current.localToWorld(new Vector3(...tip.anchor));
      const distance = worldAnchor.distanceToSquared(camera.position);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestTooltipId = tip.id;
      }
    });

    setActiveTooltipId((current) => (current === nearestTooltipId ? current : nearestTooltipId));
  });

  return (
    <>
      {METASTASEN_TOOLTIPS.map((tip) => {
        const isActive = tip.id === activeTooltipId;

        return (
          <group key={tip.id}>
            <mesh position={tip.anchor}>
              <sphereGeometry args={[0.01, 12, 12]} />
              <meshStandardMaterial
                color="#f8fafc"
                emissive="#ffffff"
                emissiveIntensity={0.35}
                depthTest={false}
              />
            </mesh>

            {isActive ? (
              <>
                <Line
                  points={[tip.anchor, tip.lineEnd]}
                  color="#f8fafc"
                  lineWidth={2}
                  depthTest={false}
                />

                <Html position={tip.label} sprite>
                  <div
                    style={{
                      background: "rgba(8, 15, 30, 0.82)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.22)",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      lineHeight: "1.25",
                      fontSize: textSize,
                      width: isMobile ? "150px" : isTablet ? "190px" : "220px",
                      maxWidth: "220px",
                      textAlign: "center",
                      pointerEvents: "none",
                      transform:
                        tip.labelSide === "left"
                          ? "translate(-100%, -50%)"
                          : "translate(0, -50%)",
                    }}
                  >
                    {text}
                  </div>
                </Html>
              </>
            ) : null}
          </group>
        );
      })}
    </>
  );
};

const RotatingMetastasen = ({ isMobile, isTablet, text, shouldRotate }) => {
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
      <Metastasen />
      <MetastasenTooltips
        isMobile={isMobile}
        isTablet={isTablet}
        text={text}
        modelGroupRef={groupRef}
      />
    </group>
  );
};

const ModelMetastasen = ({ autoRotate = true, onInteractionStart, onInteractionEnd }) => {
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { lang } = useLanguage();
  const metastasenText =
    lang === "en"
      ? "In liver cancer, abnormal growth of cells in the liver forms tumors."
      : "Bei Leberkrebs bildet das abnorme Wachstum von Zellen in der Leber Tumore.";

  return (
    <Canvas camera={{ position: [0, 1, 6], fov: 50 }}>
      <ambientLight intensity={10} color="#1a1a40" />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <directionalLight position={[-5, -5, -5]} intensity={2} />
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
      <RotatingMetastasen
        isMobile={isMobile}
        isTablet={isTablet}
        text={metastasenText}
        shouldRotate={autoRotate}
      />
    </Canvas>
  );
};

export default ModelMetastasen;
