import React, { useLayoutEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import ScrollSection from "./Layout/ScrollSection.jsx";
import SplitPanel from "./Layout/SplitPanel.jsx";
import { getAsset } from "../../constants/themeAssets";
import { useLanguage } from "./Context/LanguageContext"; 
import { animationConfig } from "../lib/animationConfig";

gsap.registerPlugin(ScrollTrigger);

const Deutschland = ({
  theme = "blue",

  // Option A: {de,en} ODER string
  p1Left,
  p1Right,
  p2Left,
  p3Text,

  // theme-based images
  p2ImageKey, // e.g. "ratio"
  p2ImageAlt = "",

  // ✅ NEW: theme-based image for panel 3 (placeholder for now)
  p3ImageKey = "P3_IMAGE_PLACEHOLDER",
  p3ImageAlt = "",
}) => {
  const { lang } = useLanguage();

  const t = useMemo(() => {
    return (value) => {
      if (typeof value === "string") return value;
      if (!value) return "";
      return value[lang] ?? value.de ?? "";
    };
  }, [lang]);

  const containerRef = useRef(null);
  const panel1 = useRef(null);
  const panel2 = useRef(null);
  const panel3 = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([panel2.current, panel3.current], { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: animationConfig.scrollTrigger.panelEnd,
          scrub: animationConfig.scrollTrigger.scrub,
          pin: true,
        },
      });

      tl.to(panel1.current, { y: -100, opacity: 0, duration: animationConfig.panel.transitionDuration });

      tl.fromTo(
        panel2.current,
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: animationConfig.panel.transitionDuration }
      );
      tl.to({}, { duration: animationConfig.panel.holdDuration });

      tl.to(panel2.current, { y: -100, opacity: 0, duration: animationConfig.panel.transitionDuration });

      tl.fromTo(
        panel3.current,
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: animationConfig.panel.transitionDuration }
      );
      tl.to({}, { duration: animationConfig.panel.holdDuration });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const p2ImgSrc = p2ImageKey ? getAsset(theme, p2ImageKey) : undefined;

  // ✅ NEW: panel 3 image (theme-based) — placeholder key for now
  const p3ImgSrc = p3ImageKey ? getAsset(theme, p3ImageKey) : undefined;

  return (
    <ScrollSection id="deutschland" ref={containerRef}>
      {/* PANEL 1 */}
      <SplitPanel
        ref={panel1}
        left={<p>{t(p1Left)}</p>}
        right={<p>{t(p1Right)}</p>}
      />

      {/* PANEL 2 */}
      <SplitPanel
        ref={panel2}
        left={<p>{t(p2Left)}</p>}
        right={
          p2ImgSrc ? (
            <img
              src={p2ImgSrc}
              alt={p2ImageAlt}
              className="max-w-full max-h-full"
            />
          ) : null
        }
      />

      {/* PANEL 3 (was CenterPanel, now SplitPanel) */}
      <SplitPanel
        ref={panel3}
        left={<p>{t(p3Text)}</p>}
        right={
          p3ImgSrc ? (
            <img
              src={p3ImgSrc}
              alt={p3ImageAlt}
              className="max-w-full max-h-full"
            />
          ) : null
        }
      />
    </ScrollSection>
  );
};

export default Deutschland;
