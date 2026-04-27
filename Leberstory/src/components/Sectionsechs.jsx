import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import SplitPanel from "./Layout/SplitPanel.jsx";
import ScrollSection from "./Layout/ScrollSection.jsx";
import { animationConfig } from "../lib/animationConfig";
import { useLanguage } from "./Context/LanguageContext"; // ggf. Pfad anpassen

gsap.registerPlugin(ScrollTrigger);

const Sectionsechs = ({ leftText, rightText }) => {
  const { lang } = useLanguage();
  const sectionRef = useRef(null);
  const panelRef = useRef(null);

  const t = useMemo(() => {
    return (value) => {
      if (typeof value === "string") return value;
      if (!value) return "";
      return value[lang] ?? value.de ?? "";
    };
  }, [lang]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(panelRef.current, { opacity: 0, y: 200 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=220%",
          scrub: animationConfig.scrollTrigger.scrub,
          pin: true,
        },
      });

      tl.to(panelRef.current, {
        opacity: 1,
        y: 0,
        duration: animationConfig.panel.transitionDuration,
      });
      tl.to({}, { duration: animationConfig.panel.holdDuration });
      tl.to(panelRef.current, {
        opacity: 0,
        y: -200,
        duration: animationConfig.panel.transitionDuration,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <ScrollSection id="sectionsechs" ref={sectionRef}>
      <SplitPanel
        ref={panelRef}
        left={<p>{t(leftText)}</p>}
        right={<p>{t(rightText)}</p>}
      />
    </ScrollSection>
  );
};

export default Sectionsechs;
