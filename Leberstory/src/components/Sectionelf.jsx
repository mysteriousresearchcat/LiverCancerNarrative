import React, { useLayoutEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import ScrollSection from "./Layout/ScrollSection.jsx";
import SplitPanel from "./Layout/SplitPanel.jsx";
import { getAsset } from "../../constants/themeAssets";
import { animationConfig } from "../lib/animationConfig";
import { useLanguage } from "./Context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const Sectionelf = ({
  theme = "blue",

  heading = "Heilende Behandlung für Leberkrebs",

  l1RightText,
  l1ImageKey,
  l1ImageSrc, // string ODER {de,en}
  l1ImageAlt = "",

  l2LeftText,
  l2ImageKey,
  l2ImageSrc, // string ODER {de,en}
  l2ImageAlt = "",

  l3LeftText,
  l3ImageKey,
  l3ImageSrc, // string ODER {de,en}
  l3ImageAlt = "",
  chapterIntro = false,
}) => {
  const { lang = "de" } = useLanguage();

  const t = useMemo(() => {
    return (value) => {
      if (typeof value === "string") return value;
      if (!value) return "";
      return value[lang] ?? value.de ?? value.en ?? "";
    };
  }, [lang]);

  const pickImg = useMemo(() => {
    return (img) => {
      if (!img) return undefined;
      if (typeof img === "string") return img;
      return img[lang] ?? img.de ?? img.en ?? undefined;
    };
  }, [lang]);

  const containerRef = useRef(null);
  const layout1Ref = useRef(null);
  const layout2Ref = useRef(null);
  const layout3Ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(layout1Ref.current, chapterIntro ? { x: 200, opacity: 0 } : { x: 0, y: 0, opacity: 1 });
      gsap.set([layout2Ref.current, layout3Ref.current], { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: animationConfig.scrollTrigger.panelEnd,
          scrub: animationConfig.scrollTrigger.scrub,
          pin: true,
        },
      });

      if (chapterIntro) {
        tl.to(layout1Ref.current, { x: 0, opacity: 1, duration: animationConfig.panel.transitionDuration });
        tl.to({}, { duration: animationConfig.panel.holdDuration });
      }

      tl.to(layout1Ref.current, { x: 0, y: -200, opacity: 0, duration: animationConfig.panel.transitionDuration });

      tl.fromTo(
        layout2Ref.current,
        { y: 200, opacity: 0 },
        { y: 0, opacity: 1, duration: animationConfig.panel.transitionDuration }
      );
      tl.to({}, { duration: animationConfig.panel.holdDuration });
      tl.to(layout2Ref.current, { y: -200, opacity: 0, duration: animationConfig.panel.transitionDuration });

      tl.fromTo(
        layout3Ref.current,
        { y: 200, opacity: 0 },
        { y: 0, opacity: 1, duration: animationConfig.panel.transitionDuration }
      );
      tl.to({}, { duration: animationConfig.panel.holdDuration });
    }, containerRef);

    return () => ctx.revert();
  }, [chapterIntro]);

  const lineSrc = getAsset(theme, "line");

  const img1 = l1ImageKey ? getAsset(theme, l1ImageKey, lang) : pickImg(l1ImageSrc);
  const img2 = l2ImageKey ? getAsset(theme, l2ImageKey, lang) : pickImg(l2ImageSrc);
  const img3 = l3ImageKey ? getAsset(theme, l3ImageKey, lang) : pickImg(l3ImageSrc);

  return (
    <ScrollSection id="sectionelf" ref={containerRef}>
      {/* Layout 1 */}
      <SplitPanel
        ref={layout1Ref}
        left={
          <h2>
            {t(heading)}
            <img src={lineSrc} alt="Decorative line" className="mt-4 mb-6" />
          </h2>
        }
        right={
          <>
            <p>{t(l1RightText)}</p>
            {img1 ? <img src={img1} alt={t(l1ImageAlt)} /> : null}
          </>
        }
      />

      {/* Layout 2 */}
      <SplitPanel
        ref={layout2Ref}
        left={<p>{t(l2LeftText)}</p>}
        right={img2 ? <img src={img2} alt={t(l2ImageAlt)} /> : null}
      />

      {/* Layout 3 */}
      <SplitPanel
        ref={layout3Ref}
        left={<p>{t(l3LeftText)}</p>}
        right={img3 ? <img src={img3} alt={t(l3ImageAlt)} /> : null}
      />
    </ScrollSection>
  );
};

export default Sectionelf;
