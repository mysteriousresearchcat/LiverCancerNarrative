import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import ScrollSection from "./Layout/ScrollSection.jsx";
import SplitPanel from "./Layout/SplitPanel.jsx";
import { getAsset } from "../../constants/themeAssets";
import { animationConfig } from "../lib/animationConfig";
import { useLanguage } from "./Context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const Sectionfuenfzehn = ({
  theme = "blue",
  version = "A",
  heading,
  l1Text,
  l2LeftText,
  l2ImageSrc,
  l2ImageAlt = "",
  l2AltImageSrc = "",
  l2AltImageAlt = "",
  l2ExtraItems = [],
  surveyReturnUrl = "",
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
  const layout1Ref = useRef(null);
  const layout2Ref = useRef(null);
  const layout3Ref = useRef(null);
  const step1Ref = useRef(null);
  const step5Ref = useRef(null);
  const extraItem1Ref = useRef(null);
  const extraItem2Ref = useRef(null);
  const extraItem3Ref = useRef(null);

  const useAltLayout2 =
    (version === "B" || version === "C") && l2ExtraItems.length === 3;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(layout2Ref.current, { opacity: 0, y: 200 });
      if (layout3Ref.current) {
        gsap.set(layout3Ref.current, { opacity: 0, y: 200 });
      }
      gsap.set(step1Ref.current, { opacity: 0, y: 30 });

      if (useAltLayout2) {
        gsap.set(step5Ref.current, { opacity: 0, y: 30 });
        gsap.set(extraItem1Ref.current, { opacity: 0, y: 30 });
        gsap.set(extraItem2Ref.current, { opacity: 0, y: 30 });
        gsap.set(extraItem3Ref.current, { opacity: 0, y: 30 });
      } else {
        gsap.set(step5Ref.current, { opacity: 0, y: 30 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: animationConfig.scrollTrigger.panelEnd,
          scrub: animationConfig.scrollTrigger.scrub,
          pin: true,
        },
      });

      tl.to(layout1Ref.current, { y: -200, opacity: 0, duration: animationConfig.panel.transitionDuration });
      tl.to(
        layout2Ref.current,
        { opacity: 1, y: 0, duration: animationConfig.panel.transitionDuration },
        useAltLayout2 ? animationConfig.panel.overlapTight : animationConfig.panel.overlapLoose
      );
      tl.to(step1Ref.current, { opacity: 1, y: 0, duration: animationConfig.reveal.defaultDuration });

      if (useAltLayout2) {
        tl.to(extraItem1Ref.current, { opacity: 1, y: 0, duration: animationConfig.reveal.smallStepDuration });
        tl.to(extraItem2Ref.current, { opacity: 1, y: 0, duration: animationConfig.reveal.smallStepDuration });
        tl.to(extraItem3Ref.current, { opacity: 1, y: 0, duration: animationConfig.reveal.smallStepDuration });
        tl.to(step5Ref.current, { opacity: 1, y: 0, duration: animationConfig.reveal.smallStepDuration });
      } else {
        tl.to(step5Ref.current, { opacity: 1, y: 0, duration: animationConfig.reveal.defaultDuration });
      }
      if (layout3Ref.current) {
        tl.to(layout2Ref.current, {
          y: -200,
          opacity: 0,
          duration: animationConfig.panel.transitionDuration,
        });
        tl.fromTo(
          layout3Ref.current,
          { y: 200, opacity: 0 },
          { y: 0, opacity: 1, duration: animationConfig.panel.transitionDuration }
        );
      }
      tl.to({}, { duration: animationConfig.panel.holdDuration });
    }, containerRef);

    return () => ctx.revert();
  }, [useAltLayout2]);

  const lineSrc = getAsset(theme, "line");
  const returnButtonLabel =
    lang === "en"
      ? "Continue to the questionnaire"
      : "Weiter zum Fragebogen";
  const returnHint =
    lang === "en"
      ? "Use this button after you have finished the story."
      : "Nutzen Sie diese Schaltfläche, nachdem Sie die Geschichte beendet haben.";

  return (
    <ScrollSection id="sectionfuenfzehn" ref={containerRef}>
      <SplitPanel
        ref={layout1Ref}
        left={
          <h2>
            {t(heading)}
            {lineSrc ? (
              <img src={lineSrc} alt="Decorative line" className="mt-4 mb-6" />
            ) : null}
          </h2>
        }
        right={<p>{t(l1Text)}</p>}
      />

      <SplitPanel
        ref={layout2Ref}
        left={
          useAltLayout2 ? (
            <div className="w-full max-w-3xl grid grid-cols-1 gap-6">
              <p ref={step1Ref}>{t(l2LeftText)}</p>

              {l2ExtraItems.map((item, index) => {
                const itemRef =
                  index === 0
                    ? extraItem1Ref
                    : index === 1
                      ? extraItem2Ref
                      : extraItem3Ref;
                const iconSrc = item?.iconKey
                  ? getAsset(theme, item.iconKey, lang)
                  : undefined;

                return (
                  <div
                    key={`l2-extra-${index}`}
                    ref={itemRef}
                    className="flex items-center gap-4"
                  >
                    {iconSrc ? (
                      <img
                        src={iconSrc}
                        alt={t(item?.iconAlt)}
                        className="w-14 h-14 md:w-16 md:h-16 object-contain shrink-0"
                      />
                    ) : null}
                    <p>{t(item?.text)}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p ref={step1Ref}>{t(l2LeftText)}</p>
          )
        }
        right={
          <div className="flex w-full flex-col items-center gap-6">
            {useAltLayout2 ? (
              l2AltImageSrc ? (
                <img
                  ref={step5Ref}
                  src={l2AltImageSrc}
                  alt={t(l2AltImageAlt)}
                  className="max-w-full h-auto"
                />
              ) : (
                <div
                  ref={step5Ref}
                  className="w-full h-52 md:h-64 rounded-lg border border-white/30 flex items-center justify-center text-center p-4"
                >
                  <p className="!text-sm sm:!text-base md:!text-lg">
                    Image placeholder for version B/C layout 2
                  </p>
                </div>
              )
            ) : (
              <img
                ref={step5Ref}
                src={l2ImageSrc}
                alt={t(l2ImageAlt)}
                className="max-w-full h-auto"
              />
            )}
          </div>
        }
      />

      {surveyReturnUrl ? (
        <SplitPanel
          ref={layout3Ref}
          left={
            <div className="w-full max-w-3xl text-center lg:text-left">
              <h2>{returnButtonLabel}</h2>
            </div>
          }
          right={
            <div className="w-full max-w-3xl text-center">
              <a
                href={surveyReturnUrl}
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100 md:px-8 md:py-4 md:text-lg"
              >
                {returnButtonLabel}
              </a>
              <p className="mt-6 !text-sm sm:!text-base md:!text-lg">
                {returnHint}
              </p>
            </div>
          }
        />
      ) : null}
    </ScrollSection>
  );
};

export default Sectionfuenfzehn;
