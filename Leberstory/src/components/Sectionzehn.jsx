import React, { useLayoutEffect, useRef, useMemo, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import ScrollSection from "./Layout/ScrollSection.jsx";
import SplitPanel from "./Layout/SplitPanel.jsx";
import { getAsset } from "../../constants/themeAssets";
import { animationConfig } from "../lib/animationConfig";
import { useLanguage } from "./Context/LanguageContext"; // ✅ Pfad ggf. anpassen

gsap.registerPlugin(ScrollTrigger);

const Sectionzehn = ({
  theme = "blue",

  heading,

  l1Text,
  l1ImageKey, // ✅ "behandlung" (theme + language)
  l1ImageAlt = "",

  l2LeftText,
  l2RightText,

  l3LeftText,
  l3ImageKey,
  l3ImageSrc, // ✅ string ODER {de,en}
  l3ImageAlt = "",
  l3Order = "textFirst",
  chapterIntro = false,
}) => {
  const { lang = "de" } = useLanguage();
  const [openInfo, setOpenInfo] = useState(null);

  const t = useMemo(() => {
    return (value) => {
      if (typeof value === "string") return value;
      if (!value) return "";
      return value[lang] ?? value.de ?? value.en ?? "";
    };
  }, [lang]);

  const pickImg = useMemo(() => {
    return (img) => {
      if (!img) return "";
      if (typeof img === "string") return img;
      return img[lang] ?? img.de ?? img.en ?? "";
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

      tl.fromTo(layout2Ref.current, { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: animationConfig.panel.transitionDuration });
      tl.to({}, { duration: animationConfig.panel.holdDuration });
      tl.to(layout2Ref.current, { y: -200, opacity: 0, duration: animationConfig.panel.transitionDuration });

      tl.fromTo(layout3Ref.current, { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: animationConfig.panel.transitionDuration });
      tl.to({}, { duration: animationConfig.panel.holdDuration });
    }, containerRef);

    return () => ctx.revert();
  }, [chapterIntro]);

  const lineSrc = getAsset(theme, "line");
  const l1ImgSrc = l1ImageKey ? getAsset(theme, l1ImageKey, lang) : undefined;
  const l3ImgSrc = l3ImageKey
    ? getAsset(theme, l3ImageKey, lang)
    : pickImg(l3ImageSrc);
  const treatmentInfos = {
    curative: {
      title: { de: "Heilende Behandlung", en: "Curing treatment" },
      body: {
        de: "Ziel ist es, den Krebs vollständig zu entfernen oder zu zerstören.",
        en: "The goal is to remove or destroy the cancer completely.",
      },
      positionClassName: "left-[19%] top-[58%]",
      popupClassName: "left-[22%] top-[66%] -translate-x-1/2",
    },
    palliative: {
      title: { de: "Lebensverlängernde Behandlung", en: "Life-prolonging treatment" },
      body: {
        de: "Sie kann den Krebs nicht heilen, aber Beschwerden lindern und das Tumorwachstum verlangsamen.",
        en: "It cannot cure the cancer, but it can relieve symptoms and slow tumor growth.",
      },
      positionClassName: "right-[19%] top-[58%]",
      popupClassName: "right-[22%] top-[66%] translate-x-1/2",
    },
  };

  return (
    <ScrollSection id="sectionzehn" ref={containerRef}>
      <SplitPanel
        ref={layout1Ref}
        className="z-10"
        left={
          <h2>
            {t(heading)}
            <img src={lineSrc} alt="Decorative line" className="mt-4 mb-6" />
          </h2>
        }
        right={
          <>
            <p>{t(l1Text)}</p>
            {l1ImgSrc ? (
              <div className="relative w-full max-w-3xl self-center">
                <img
                  src={l1ImgSrc}
                  alt={t(l1ImageAlt)}
                  className="h-auto max-h-[42vh] w-full object-contain"
                />
                {Object.entries(treatmentInfos).map(([key, info]) => {
                  const isOpen = openInfo === key;
                  return (
                    <React.Fragment key={key}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-label={t(info.title)}
                        onClick={() =>
                          setOpenInfo((current) => (current === key ? null : key))
                        }
                        className={`absolute ${info.positionClassName} flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-slate-900/85 text-lg font-semibold text-white shadow-md transition hover:scale-105`}
                      >
                        ?
                        </button>
                      {isOpen ? (
                        <div
                          className={`absolute ${info.popupClassName} z-10 w-56 rounded-xl border border-white/15 bg-slate-950/90 p-3 text-sm text-white shadow-xl backdrop-blur-sm md:w-64`}
                        >
                          <p className="mb-1 text-base font-semibold">{t(info.title)}</p>
                          <p className="text-sm leading-relaxed">{t(info.body)}</p>
                        </div>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </div>
            ) : null}
          </>
        }
      />

      <SplitPanel
        ref={layout2Ref}
        className="z-0"
        left={<p>{t(l2LeftText)}</p>}
        right={<p>{t(l2RightText)}</p>}
      />

      <SplitPanel
        ref={layout3Ref}
        className="z-0"
        left={
          l3Order === "imageFirst" ? (
            l3ImgSrc ? <img src={l3ImgSrc} alt={t(l3ImageAlt)} /> : null
          ) : (
            <p>{t(l3LeftText)}</p>
          )
        }
        right={
          l3Order === "imageFirst" ? (
            <p>{t(l3LeftText)}</p>
          ) : l3ImgSrc ? (
            <img src={l3ImgSrc} alt={t(l3ImageAlt)} />
          ) : null
        }
      />
    </ScrollSection>
  );
};

export default Sectionzehn;
