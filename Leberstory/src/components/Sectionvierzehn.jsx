import React, { useLayoutEffect, useRef, useCallback, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import ScrollSection from "./Layout/ScrollSection.jsx";
import SplitPanel from "./Layout/SplitPanel.jsx";
import CenterPanel from "./Layout/CenterPanel.jsx";
import { getAsset } from "../../constants/themeAssets";
import { animationConfig } from "../lib/animationConfig";
import { useLanguage } from "./Context/LanguageContext"; // ✅ Pfad ggf. anpassen

gsap.registerPlugin(ScrollTrigger);

const Sectionvierzehn = ({
  theme = "blue",

  heading,
  introText,
  bullets = [],
  chapterIntro = false,
  items = [], // [{ assetKey, text, alt? }]
}) => {
  const { lang } = useLanguage();

  const t = useMemo(() => {
    return (value) => {
      if (typeof value === "string") return value;
      if (!value) return "";
      return value[lang] ?? value.de ?? "";
    };
  }, [lang]);

  const resolvedBullets = useMemo(() => {
    if (Array.isArray(bullets)) return bullets;
    if (bullets && typeof bullets === "object") {
      return bullets[lang] ?? bullets.de ?? bullets.en ?? [];
    }
    return [];
  }, [bullets, lang]);

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
      gsap.set(introRef.current, chapterIntro ? { x: 200, opacity: 0 } : { y: 0, opacity: 1 });
      gsap.set(cardRefs.current, { y: 120, opacity: 0 });

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
        tl.to(introRef.current, {
          x: 0,
          opacity: 1,
          duration: animationConfig.panel.transitionDuration,
          ease: "power3.out",
        });
        tl.to({}, { duration: animationConfig.panel.holdDuration });
      }

      tl.to(introRef.current, {
        x: 0,
        y: -100,
        opacity: 0,
        duration: animationConfig.panel.transitionDuration,
        ease: "power2.inOut",
      });

      tl.to(
        cardRefs.current,
        {
          y: 0,
          opacity: 1,
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

  const lineSrc = getAsset(theme, "line");

  return (
    <ScrollSection ref={sectionRef} id="sectionvierzehn">
      <SplitPanel
        ref={introRef}
        left={
          <h2>
            {t(heading)}
            <img src={lineSrc} alt="Decorative line" className="mt-4 mb-6" />
          </h2>
        }
        right={
          <div>
            <p>{t(introText)}</p>
            <ul className="list-disc m-10 text-base/relaxed sm:text-lg/relaxed md:text-3xl/relaxed lg:text-2xl/relaxed xl:text-3xl/relaxed font-medium">
              {resolvedBullets.map((b, i) => (
                <li
                  key={i}
                  className="text-base/relaxed sm:text-lg/relaxed md:text-3xl/relaxed lg:text-2xl/relaxed xl:text-3xl/relaxed font-medium"
                >
                  {t(b)}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <CenterPanel>
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {items.map((item, idx) => {
            const src = item.assetKey ? getAsset(theme, item.assetKey) : undefined;

            return (
              <div
                key={idx}
                ref={addToRefs}
                className="flex flex-col items-center text-center w-full"
              >
                <div className="h-32 w-full flex items-center justify-center">
                  {src ? (
                    <img
                      src={src}
                      alt={t(item.alt) || t(item.text)}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : null}
                </div>
                <p className="mt-4">{t(item.text)}</p>
              </div>
            );
          })}
        </div>
      </CenterPanel>
    </ScrollSection>
  );
};

export default Sectionvierzehn;
