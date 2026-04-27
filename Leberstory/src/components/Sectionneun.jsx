import React, { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import ScrollSection from "./Layout/ScrollSection.jsx";
import SplitPanel from "./Layout/SplitPanel.jsx";
import CenterPanel from "./Layout/CenterPanel.jsx";
import { getAsset } from "../../constants/themeAssets";
import ThomasMrt from "../images/Thomas_MRT.png";
import { useLanguage } from "./Context/LanguageContext";
import { animationConfig } from "../lib/animationConfig";

gsap.registerPlugin(ScrollTrigger);

const Sectionneun = ({
  theme = "blue",
  heading,
  introRight,
  q1Text,
  q1ImageSrc,
  q1ImageAlt = "",
  q2Text,
  q2ImageSrc,
  q2ImageAlt = "",
  q3Text,
  q3ImageSrc,
  q3ImageAlt = "",
  q4Text,
  q4ImageSrc,
  q4ImageAlt = "",
  methodsIntro,
  method1ImageKey,
  method1Label,
  method1Alt = "",
  method2ImageKey,
  method2Label,
  method2Alt = "",
  method3ImageKey,
  method3Label,
  method3Alt = "",
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
  const layout4Ref = useRef(null);
  const layout5Ref = useRef(null);
  const layout6Ref = useRef(null);
  const layout7Ref = useRef(null);
  const layout8Ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [
          layout2Ref.current,
          layout3Ref.current,
          layout4Ref.current,
          layout5Ref.current,
          layout6Ref.current,
          layout7Ref.current,
          layout8Ref.current,
        ],
        { opacity: 0 }
      );

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

      tl.fromTo(layout8Ref.current, { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: animationConfig.panel.transitionDuration });
      tl.to({}, { duration: animationConfig.panel.holdDuration });
      tl.to(layout8Ref.current, { y: -200, opacity: 0, duration: animationConfig.panel.transitionDuration });

      tl.fromTo(layout2Ref.current, { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: animationConfig.panel.transitionDuration });
      tl.to({}, { duration: animationConfig.panel.holdDuration });
      tl.to(layout2Ref.current, { y: -200, opacity: 0, duration: animationConfig.panel.transitionDuration });

      tl.fromTo(layout3Ref.current, { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: animationConfig.panel.transitionDuration });
      tl.to({}, { duration: animationConfig.panel.holdDuration });
      tl.to(layout3Ref.current, { y: -200, opacity: 0, duration: animationConfig.panel.transitionDuration });

      tl.fromTo(layout4Ref.current, { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: animationConfig.panel.transitionDuration });
      tl.to({}, { duration: animationConfig.panel.holdDuration });
      tl.to(layout4Ref.current, { y: -200, opacity: 0, duration: animationConfig.panel.transitionDuration });

      tl.fromTo(layout5Ref.current, { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: animationConfig.panel.transitionDuration });
      tl.to({}, { duration: animationConfig.panel.holdDuration });
      tl.to(layout5Ref.current, { y: -200, opacity: 0, duration: animationConfig.panel.transitionDuration });

      tl.fromTo(layout6Ref.current, { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: animationConfig.panel.transitionDuration });
      tl.to({}, { duration: animationConfig.panel.holdDuration });
      tl.to(layout6Ref.current, { y: -200, opacity: 0, duration: animationConfig.panel.transitionDuration });

      tl.fromTo(layout7Ref.current, { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: animationConfig.panel.transitionDuration });
      tl.to({}, { duration: animationConfig.panel.holdDuration });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const lineSrc = getAsset(theme, "line");
  const method1Src = method1ImageKey ? getAsset(theme, method1ImageKey) : undefined;
  const method2Src = method2ImageKey ? getAsset(theme, method2ImageKey) : undefined;
  const method3Src = method3ImageKey ? getAsset(theme, method3ImageKey) : undefined;
  const q1Src = getAsset(theme, "liver1") || q1ImageSrc;
  const q2Src = getAsset(theme, "liver1") || q2ImageSrc;
  const q3Src = getAsset(theme, "liver2") || q3ImageSrc;
  const q4Src = getAsset(theme, "liver3") || q4ImageSrc;

  return (
    <ScrollSection id="sectionneun" ref={containerRef}>
      <SplitPanel
        ref={layout1Ref}
        className="px-4 lg:px-8"
        panelClassName="p-4 lg:p-8"
        left={
          <h2>
            {t(heading)}
            <img src={lineSrc} alt="Decorative line" className="mt-4 mb-6" />
          </h2>
        }
        right={
          <div className="flex flex-col items-center justify-center gap-6">
            <p>{t(introRight)}</p>
            <img
              src={ThomasMrt}
              alt={
                lang === "en"
                  ? "Thomas and his doctor discussing the MRI findings"
                  : "Thomas und sein Arzt besprechen die MRT-Befunde"
              }
              className="max-w-full mx-auto object-contain md:max-w-2xl"
            />
          </div>
        }
      />

      <SplitPanel
        ref={layout8Ref}
        className="px-4 lg:px-8"
        panelClassName="p-4 lg:p-8"
        left={<p>{t(q1Text)}</p>}
        right={
          <img
            src={q1Src}
            alt={t(q1ImageAlt)}
            className="max-w-full mx-auto object-contain"
          />
        }
      />

      <SplitPanel
        ref={layout2Ref}
        className="px-4 lg:px-8"
        panelClassName="p-4 lg:p-8"
        left={<p>{t(methodsIntro)}</p>}
        right={
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            {method1Src ? (
              <img
                src={method1Src}
                alt={t(method1Alt) || t(method1Label)}
                className="max-w-full mx-auto object-contain"
              />
            ) : null}
            <p className="text-center">{t(method1Label)}</p>
          </div>
        }
      />

      <CenterPanel ref={layout3Ref}>
        <div className="w-full flex flex-col items-center justify-center gap-6 text-center">
          {method2Src ? (
            <img
              src={method2Src}
              alt={t(method2Alt) || t(method2Label)}
              className="max-w-full mx-auto object-contain"
            />
          ) : null}
          <p className="text-center">{t(method2Label)}</p>
        </div>
      </CenterPanel>

      <CenterPanel ref={layout4Ref}>
        <div className="w-full flex flex-col items-center justify-center gap-6 text-center">
          {method3Src ? (
            <img
              src={method3Src}
              alt={t(method3Alt) || t(method3Label)}
              className="max-w-full mx-auto object-contain"
            />
          ) : null}
          <p className="text-center">{t(method3Label)}</p>
        </div>
      </CenterPanel>

      <SplitPanel
        ref={layout5Ref}
        className="px-4 lg:px-8"
        panelClassName="p-4 lg:p-8"
        left={<p>{t(q2Text)}</p>}
        right={
          <img
            src={q2Src}
            alt={t(q2ImageAlt)}
            className="max-w-full mx-auto object-contain"
          />
        }
      />

      <SplitPanel
        ref={layout6Ref}
        className="px-4 lg:px-8"
        panelClassName="p-4 lg:p-8"
        left={<p>{t(q3Text)}</p>}
        right={
          <img
            src={q3Src}
            alt={t(q3ImageAlt)}
            className="max-w-full mx-auto object-contain"
          />
        }
      />

      <SplitPanel
        ref={layout7Ref}
        className="px-4 lg:px-8"
        panelClassName="p-4 lg:p-8"
        left={<p>{t(q4Text)}</p>}
        right={
          <img
            src={q4Src}
            alt={t(q4ImageAlt)}
            className="max-w-full mx-auto object-contain"
          />
        }
      />
    </ScrollSection>
  );
};

export default Sectionneun;
