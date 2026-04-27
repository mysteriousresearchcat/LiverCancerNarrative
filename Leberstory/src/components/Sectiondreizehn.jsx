import React, { useLayoutEffect, useRef, useMemo, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import ScrollSection from "./Layout/ScrollSection.jsx";
import SplitPanel from "./Layout/SplitPanel.jsx";
import { getAsset } from "../../constants/themeAssets";
import { animationConfig } from "../lib/animationConfig";
import { useLanguage } from "./Context/LanguageContext"; // ✅ Pfad ggf. anpassen

gsap.registerPlugin(ScrollTrigger);

const Sectiondreizehn = ({
  theme = "blue",

  heading,

  // Layout 1
  l1Text1,
  l1Text2,
  l1Rate,
  l1RateImageKey,
  l1RateImageAlt = "",

  // Step 1
  step1Label,

  // Step 2
  step2Text,
  step2FemaleRate,
  step2FemaleIconKey,
  step2FemaleIconAlt = "",
  step2MaleRate,
  step2MaleIconKey,
  step2MaleIconAlt = "",

  // Step 3
  step3Text,
  step3Rate,
  step3IconKey,
  step3IconAlt = "",
  chapterIntro = false,
}) => {
  const { lang } = useLanguage();
  const [showMetastasesInfo, setShowMetastasesInfo] = useState(false);

  // Option A: allow string OR {de,en}
  const t = useMemo(() => {
    return (value) => {
      if (typeof value === "string") return value;
      if (!value) return "";
      return value[lang] ?? value.de ?? "";
    };
  }, [lang]);

  const containerRef = useRef(null);
  const layout1Ref = useRef(null);
  const layout2Ref = useRef(null);
  const step1Ref = useRef(null);
  const step2BlockRef = useRef(null);
  const step3BlockRef = useRef(null);
  const l1RateBlockRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(layout1Ref.current, chapterIntro ? { x: 200, opacity: 0 } : { x: 0, y: 0, opacity: 1 });
      gsap.set(layout2Ref.current, { opacity: 0, y: 200 });
      gsap.set(l1RateBlockRef.current, { opacity: 0, y: 30 });
      gsap.set(step1Ref.current, { opacity: 0, y: 30 });
      gsap.set(step2BlockRef.current, { opacity: 0, y: 30 });
      gsap.set(step3BlockRef.current, { opacity: 0, y: 30 });

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

      tl.to(l1RateBlockRef.current, { opacity: 1, y: 0, duration: animationConfig.reveal.defaultDuration });
      tl.to(layout1Ref.current, { x: 0, y: -200, opacity: 0, duration: animationConfig.panel.transitionDuration });
      tl.to(layout2Ref.current, { opacity: 1, y: 0, duration: animationConfig.panel.transitionDuration });
      tl.to(step1Ref.current, { opacity: 1, y: 0, duration: animationConfig.reveal.defaultDuration });
      tl.to(step2BlockRef.current, { opacity: 1, y: 0, duration: animationConfig.reveal.defaultDuration });
      tl.to(step3BlockRef.current, { opacity: 1, y: 0, duration: animationConfig.reveal.defaultDuration });
      tl.to({}, { duration: animationConfig.panel.holdDuration });
    }, containerRef);

    return () => ctx.revert();
  }, [chapterIntro]);

  const lineSrc = getAsset(theme, "line");
  const l1IconSrc = l1RateImageKey ? getAsset(theme, l1RateImageKey) : undefined;
  const femaleSrc = step2FemaleIconKey ? getAsset(theme, step2FemaleIconKey) : undefined;
  const maleSrc = step2MaleIconKey ? getAsset(theme, step2MaleIconKey) : undefined;
  const step3Src = step3IconKey ? getAsset(theme, step3IconKey) : undefined;
  const step3TextValue = t(step3Text);
  const distantMetastasesInfo = {
    en: "This means the cancer has spread from the liver to distant parts of the body.",
  };
  const distantMetastasesLabel = {
    en: "What are distant metastases?",
  };

  const renderStep3Text = () => {
    if (!step3TextValue.includes("distant metastases")) {
      return <p>{step3TextValue}</p>;
    }

    const [before, after] = step3TextValue.split("distant metastases");

    return (
      <div className="relative">
        <p>
          {before}
          <span className="font-semibold">distant metastases</span>
          {after}
          <button
            type="button"
            aria-expanded={showMetastasesInfo}
            aria-label={t(distantMetastasesLabel)}
            onClick={() => setShowMetastasesInfo((current) => !current)}
            className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/70 bg-slate-900/85 text-sm font-semibold text-white align-middle shadow-md transition hover:scale-105"
          >
            ?
          </button>
        </p>
        {showMetastasesInfo ? (
          <div className="mt-3 max-w-md rounded-xl border border-white/15 bg-slate-950/90 p-3 text-sm text-white shadow-xl backdrop-blur-sm">
            <p className="text-sm leading-relaxed">{t(distantMetastasesInfo)}</p>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <ScrollSection id="sectiondreizehn" ref={containerRef}>
      {/* LAYOUT 1 */}
      <SplitPanel
        ref={layout1Ref}
        rightClassName="prognosis-centered-column"
        left={
          <h2>
            {t(heading)}
            <img src={lineSrc} alt="Decorative line" className="mt-4 mb-6" />
          </h2>
        }
        right={
          <>
            <p>{t(l1Text1)}</p>
            <p>{t(l1Text2)}</p>

            <div
              ref={l1RateBlockRef}
              className="prognosis-rate-block flex flex-col items-center text-center"
            >
              <h2>{t(l1Rate)}</h2>
              {l1IconSrc ? (
                <img
                  src={l1IconSrc}
                  alt={t(l1RateImageAlt)}
                  className="prognosis-rate-icon w-20 md:w-40 h-auto object-contain"
                />
              ) : null}
            </div>
          </>
        }
      />

      {/* LAYOUT 2 */}
      <SplitPanel
        ref={layout2Ref}
        leftClassName="prognosis-centered-column"
        rightClassName="prognosis-centered-column"
        left={
          <div ref={step1Ref} className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 lg:gap-x-20 items-stretch">
            <p className="w-full max-w-xl mx-auto !text-center justify-self-center self-center">
              {t(step1Label)}
            </p>

            {/* ✅ Theme-based bar (uses your CSS variable) */}
            <div
              className="h-3 w-[85vw] max-w-md justify-self-center md:justify-self-end rounded-full md:w-3 md:h-full md:min-h-72 lg:min-h-[32rem]"
              style={{ backgroundColor: "var(--nav-active)" }}
            />
          </div>
        }
        right={
          <>
            <div
              ref={step2BlockRef}
              className="prognosis-step2-block grid w-full max-w-3xl gap-6"
            >
              {/* STEP 2 TEXT */}
              <p>{t(step2Text)}</p>

              {/* STEP 2 ICONS */}
              <div
                className="prognosis-step2-icons grid grid-cols-2 gap-6"
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <p>{t(step2FemaleRate)}</p>
                  <div className="prognosis-icon-box">
                    {femaleSrc ? (
                      <img
                        src={femaleSrc}
                        alt={t(step2FemaleIconAlt)}
                        className="prognosis-step2-icon h-full w-full object-contain"
                      />
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3 text-center">
                  <p>{t(step2MaleRate)}</p>
                  <div className="prognosis-icon-box">
                    {maleSrc ? (
                      <img
                        src={maleSrc}
                        alt={t(step2MaleIconAlt)}
                        className="prognosis-step2-icon h-full w-full object-contain"
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3 TEXT */}
            <div
              ref={step3BlockRef}
              className="prognosis-step3 flex flex-col items-center gap-3 text-center"
            >
              <div className="prognosis-step3-text">
                {renderStep3Text()}
              </div>
              <p>{t(step3Rate)}</p>
              <div className="prognosis-icon-box prognosis-icon-box--wide">
                {step3Src ? (
                  <img
                    src={step3Src}
                    alt={t(step3IconAlt)}
                    className="prognosis-step3-icon h-full w-full object-contain"
                  />
                ) : null}
              </div>
            </div>
          </>
        }
      />
    </ScrollSection>
  );
};

export default Sectiondreizehn;
