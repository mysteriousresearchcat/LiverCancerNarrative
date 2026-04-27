import React, { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { Model as Ananeu } from "@/components/Ananeu.jsx";
import { useLanguage } from "../Context/LanguageContext";

const ORGANE_TOOLTIP_CONTENT = [
  {
    id: "heart",
    anchor: [1, 0.8, 0.1],
    text: { de: "Herz", en: "Heart" },
  },
  {
    id: "liver_vessels",
    anchor: [-0.9, -0.04, 0.08],
    text: {
      de: "Zahlreiche Blutgefaesse versorgen und entwaessern die Leber",
      en: "Numerous blood vessels supply and drain the liver",
    },
  },
];

const ORGANE_TOOLTIP_LAYOUTS = {
  front: {
    heart: [3.15, 1.45, 0.32],
    liver_vessels: [-3.35, 0.1, 0.34],
  },
  back: {
    heart: [3.2, 1.9, -0.28],
    liver_vessels: [-3.45, -0.75, -0.26],
  },
};

const normalizeAngle = (angle) => {
  let nextAngle = angle;

  while (nextAngle <= -Math.PI) nextAngle += Math.PI * 2;
  while (nextAngle > Math.PI) nextAngle -= Math.PI * 2;

  return nextAngle;
};

const OrganeTooltips = ({ isMobile, isTablet, lang, modelGroupRef }) => {
  const textSize = isMobile ? "14px" : isTablet ? "16px" : "18px";
  const { camera } = useThree();
  const [layoutKey, setLayoutKey] = useState("front");
  const [activeTooltipId, setActiveTooltipId] = useState("heart");

  useFrame(() => {
    const cameraAzimuth = Math.atan2(camera.position.x, camera.position.z);
    const modelRotationY = modelGroupRef.current?.rotation?.y ?? 0;
    const relativeAzimuth = normalizeAngle(cameraAzimuth - modelRotationY);
    const nextLayoutKey =
      Math.abs(relativeAzimuth) > Math.PI / 2 ? "back" : "front";
    const nextActiveTooltipId =
      Math.abs(relativeAzimuth) > Math.PI / 2 ? "liver_vessels" : "heart";

    setLayoutKey((current) => (current === nextLayoutKey ? current : nextLayoutKey));
    setActiveTooltipId((current) =>
      current === nextActiveTooltipId ? current : nextActiveTooltipId
    );
  });

  return (
    <>
      {ORGANE_TOOLTIP_CONTENT.map((tip) => {
        const label = ORGANE_TOOLTIP_LAYOUTS[layoutKey][tip.id];
        const isActive = tip.id === activeTooltipId;
        const lineEnd = [
          (tip.anchor[0] + label[0]) / 2,
          (tip.anchor[1] + label[1]) / 2,
          (tip.anchor[2] + label[2]) / 2,
        ];

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
                  points={[tip.anchor, lineEnd]}
                  color="#f8fafc"
                  lineWidth={2}
                  depthTest={false}
                />

                <Html position={lineEnd} sprite center>
                  <div
                    style={{
                      background: "rgba(8, 15, 30, 0.82)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.22)",
                      borderRadius: "8px",
                      padding: "6px 10px",
                      fontSize: textSize,
                      lineHeight: "1.25",
                      whiteSpace: "normal",
                      maxWidth: isMobile ? "150px" : isTablet ? "190px" : "230px",
                      textAlign: "center",
                      pointerEvents: "none",
                      opacity: 1,
                      transition: "opacity 180ms ease",
                    }}
                  >
                    {tip.text?.[lang] ?? tip.text?.de ?? ""}
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

const RotatingOrgane = ({ isMobile, isTablet, lang, shouldRotate }) => {
  const groupRef = useRef(null);
  const modelScale = isMobile ? 0.012 : isTablet ? 0.016 : 0.02;

  useFrame(() => {
    if (shouldRotate && groupRef.current) groupRef.current.rotation.y += 0.003;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, -Math.PI / 4, 0]}>
      <group scale={modelScale}>
        <Ananeu />
      </group>
      <OrganeTooltips
        isMobile={isMobile}
        isTablet={isTablet}
        lang={lang}
        modelGroupRef={groupRef}
      />
    </group>
  );
};

const ModelOrgane = ({ autoRotate = true, onInteractionStart, onInteractionEnd }) => {
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { lang } = useLanguage();

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
      <RotatingOrgane
        isMobile={isMobile}
        isTablet={isTablet}
        lang={lang}
        shouldRotate={autoRotate}
      />
    </Canvas>
  );
};

export default ModelOrgane;
