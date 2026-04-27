import React, { useLayoutEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollSection from "./Layout/ScrollSection.jsx";
import SplitPanel from "./Layout/SplitPanel.jsx";
import { getAsset } from "../../constants/themeAssets";
import { animationConfig } from "../lib/animationConfig";
import { useLanguage } from "./Context/LanguageContext"; // ✅ Pfad ggf. anpassen

gsap.registerPlugin(ScrollTrigger);

const Sectionzwoelf = ({
  theme = "blue",

  heading,

  p1Text,
  p1Items = [], // [{ assetKey, text:{de,en}|string, alt?:{de,en}|string }]

  p2Text,
  p2Items = [], // [{ assetKey, text:{de,en}|string, alt?:{de,en}|string }]
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
  const initialRef = useRef(null);
  const remainingRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(initialRef.current, { autoAlpha: 1, y: 0 });
      gsap.set(remainingRef.current, { autoAlpha: 0, y: 200 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: animationConfig.scrollTrigger.panelEnd,
          scrub: animationConfig.scrollTrigger.scrub,
          pin: true,
        },
      });

      tl.to(initialRef.current, {
        autoAlpha: 0,
        y: -200,
        duration: animationConfig.panel.transitionDuration,
        ease: "none",
      });

      tl.set(remainingRef.current, { autoAlpha: 1 });

      tl.to(
        remainingRef.current,
        {
          y: 0,
          duration: animationConfig.panel.transitionDuration,
          ease: "none",
        },
        "<"
      );
      tl.to({}, { duration: animationConfig.panel.holdDuration });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const lineSrc = getAsset(theme, "line");

  return (
    <ScrollSection id="sectionzwoelf" ref={containerRef}>
      {/* PANEL 1 */}
      <SplitPanel
        ref={initialRef}
        left={
          <h2>
            {t(heading)}
            <img src={lineSrc} alt="Decorative line" className="mt-4 mb-6" />
          </h2>
        }
        right={
          <>
            <p>{t(p1Text)}</p>

            <div className="w-full max-w-6xl grid grid-cols-3 gap-8 lg:gap-10 mt-6">
              {p1Items.map((item, idx) => {
                const src = item.assetKey ? getAsset(theme, item.assetKey) : undefined;
                const label = t(item.text);
                const alt = item.alt ? t(item.alt) : label;

                return (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div className="h-32 w-full flex items-center justify-center">
                      {src ? (
                        <img
                          src={src}
                          alt={alt}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : null}
                    </div>
                    <p className="icon-grid-label mt-2 min-h-[2.75rem] lg:min-h-[3.25rem]">
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        }
      />

      {/* PANEL 2 */}
      <SplitPanel
        ref={remainingRef}
        left={<p>{t(p2Text)}</p>}
        right={
          <div className="w-full max-w-6xl grid grid-cols-3 gap-8 lg:gap-10 mt-6">
            {p2Items.map((item, idx) => {
              const src = item.assetKey ? getAsset(theme, item.assetKey) : undefined;
              const label = t(item.text);
              const alt = item.alt ? t(item.alt) : label;

              return (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="h-32 w-full flex items-center justify-center">
                    {src ? (
                      <img
                        src={src}
                        alt={alt}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : null}
                  </div>
                  <p className="icon-grid-label mt-2 min-h-[2.75rem] lg:min-h-[3.25rem]">
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        }
      />
    </ScrollSection>
  );
};

export default Sectionzwoelf;
