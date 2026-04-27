import React, { useLayoutEffect, useRef, useCallback, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import ScrollSection from "./Layout/ScrollSection.jsx";
import SplitPanel from "./Layout/SplitPanel.jsx";
import { getAsset } from "../../constants/themeAssets";
import { animationConfig } from "../lib/animationConfig";
import { useLanguage } from "./Context/LanguageContext"; // ✅ ggf. Pfad anpassen

gsap.registerPlugin(ScrollTrigger);

const Sectionacht = ({
  theme = "blue",
  heading,
  introText,
  chapterIntro = false,
  items = [], // [{ assetKey, text: {de,en}|string, alt?: {de,en}|string }]
}) => {
  const { lang } = useLanguage();

  const t = useMemo(() => {
    return (value) => {
      if (typeof value === "string") return value;
      if (!value) return "";
      return value[lang] ?? value.de ?? "";
    };
  }, [lang]);

  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const cardRefs = useRef([]);

  cardRefs.current = [];

  const addToRefs = useCallback((el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(cardRefs.current, { opacity: 0, y: 120 });
      gsap.set(introRef.current, chapterIntro ? { x: 200, opacity: 0 } : { y: 0, opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: animationConfig.scrollTrigger.panelEnd,
          scrub: animationConfig.scrollTrigger.scrub,
          pin: true,
        },
      });

      if (chapterIntro) {
        tl.to(introRef.current, { x: 0, opacity: 1, duration: animationConfig.panel.transitionDuration });
        tl.to({}, { duration: animationConfig.panel.holdDuration });
      }

      tl.to(introRef.current, { x: 0, y: -100, opacity: 0, duration: animationConfig.panel.transitionDuration });

      tl.to(
        cardRefs.current,
        {
          opacity: 1,
          y: 0,
          stagger: animationConfig.panel.staggerDelay,
          duration: animationConfig.panel.staggerDuration,
          ease: "power3.out",
        },
        animationConfig.panel.overlapNormal
      );
      tl.to({}, { duration: animationConfig.panel.holdDuration });
    }, sectionRef);

    return () => ctx.revert();
  }, [chapterIntro]);

  const firstRow = items.slice(0, 3);
  const secondRow = items.slice(3);

  const lineSrc = getAsset(theme, "line");

  return (
    <ScrollSection ref={sectionRef} id="sectionacht">
      {/* INTRO CONTENT */}
      <SplitPanel
        ref={introRef}
        left={
          <h2>
            {t(heading)}
            <img src={lineSrc} alt="Decorative line" className="mt-4 mb-6" />
          </h2>
        }
        right={<p>{t(introText)}</p>}
      />

      {/* ICON GRID */}
      <div className="absolute inset-0 flex items-center justify-center p-20">
        <div className="w-full max-w-5xl lg:max-w-7xl xl:max-w-[100rem] grid grid-cols-3 gap-8 lg:gap-10">
          {/* FIRST ROW */}
          {firstRow.map((item, idx) => {
            const src = item.assetKey ? getAsset(theme, item.assetKey) : undefined;

            return (
              <div
                key={idx}
                ref={addToRefs}
                className="flex flex-col items-center text-center w-full"
              >
                <div className="h-32 lg:h-40 w-full flex items-center justify-center">
                  {src ? (
                    <img
                      src={src}
                      alt={t(item.alt) || t(item.text)}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : null}
                </div>
                <p className="icon-grid-label mt-4 min-h-[2.75rem] lg:min-h-[4rem]">
                  {t(item.text)}
                </p>
              </div>
            );
          })}

          {/* SECOND ROW */}
          <div className="col-span-3 grid grid-cols-4 gap-8 lg:gap-10">
            {secondRow.map((item, idx) => {
              const src = item.assetKey ? getAsset(theme, item.assetKey) : undefined;

              return (
                <div
                  key={idx + 3}
                  ref={addToRefs}
                  className="flex flex-col items-center text-center w-full"
                >
                  <div className="h-32 lg:h-40 w-full flex items-center justify-center">
                    {src ? (
                      <img
                        src={src}
                        alt={t(item.alt) || t(item.text)}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : null}
                  </div>
                  <p className="icon-grid-label mt-4 min-h-[2.75rem] lg:min-h-[4rem]">
                    {t(item.text)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollSection>
  );
};

export default Sectionacht;
