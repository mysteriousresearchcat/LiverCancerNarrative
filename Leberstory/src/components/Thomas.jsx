import React, { useLayoutEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import ScrollSection from "./Layout/ScrollSection.jsx";
import SplitPanel from "./Layout/SplitPanel.jsx";
import CenterPanel from "./Layout/CenterPanel.jsx";
import { getAsset } from "../../constants/themeAssets";
import { animationConfig } from "../lib/animationConfig";
import { useLanguage } from "./Context/LanguageContext"; // ✅ ggf. Pfad anpassen

gsap.registerPlugin(ScrollTrigger);

const Thomas = ({
  theme = "blue",

  // Option A: {de,en} ODER string
  heading,
  body,

  // Panel 2 stays unchanged (text later still translatable)
  panel2Variant = "image",
  panel2Text,
  panel2ImageSrc,
  panel2ImageAlt = "",
  // Backward-compatible aliases used in narratives A/B
  imageSrc,
  imageAlt = "",
}) => {
  const { lang } = useLanguage();

  const t = useMemo(() => {
    return (value) => {
      if (typeof value === "string") return value;
      if (!value) return "";
      return value[lang] ?? value.de ?? "";
    };
  }, [lang]);

  const triggerRef = useRef(null);
  const panel1Ref = useRef(null);
  const panel2Ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: animationConfig.scrollTrigger.panelEnd,
          scrub: animationConfig.scrollTrigger.scrub,
          pin: true,
        },
      });

      tl.to(panel1Ref.current, {
        opacity: 0,
        y: -100,
        duration: animationConfig.panel.transitionDuration,
      });

      tl.fromTo(
        panel2Ref.current,
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: animationConfig.panel.transitionDuration }
      );
      tl.to({}, { duration: animationConfig.panel.holdDuration });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  const lineSrc = getAsset(theme, "line"); // theme-based only
  const resolvedPanel2ImageSrc = panel2ImageSrc || imageSrc;
  const resolvedPanel2ImageAlt = t(panel2ImageAlt || imageAlt);

  return (
    <ScrollSection id="thomas" ref={triggerRef}>
      {/* PANEL 1 */}
      <SplitPanel
        ref={panel1Ref}
        left={
          <h2>
            {t(heading)}
            <img src={lineSrc} alt="Decorative line" className="mt-4 mb-6" />
          </h2>
        }
        right={<p>{t(body)}</p>}
      />

      {/* PANEL 2 */}
      {panel2Variant === "image" ? (
        <CenterPanel ref={panel2Ref}>
          <img src={resolvedPanel2ImageSrc} alt={resolvedPanel2ImageAlt} />
        </CenterPanel>
      ) : (
        <SplitPanel
          ref={panel2Ref}
          left={<p>{t(panel2Text)}</p>}
          right={<img src={resolvedPanel2ImageSrc} alt={resolvedPanel2ImageAlt} />}
        />
      )}
    </ScrollSection>
  );
};

export default Thomas;
