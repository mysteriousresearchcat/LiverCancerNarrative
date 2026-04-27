import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ModelMetastasen from "./Models/ModelMetastasen";
import { getAsset } from "../../constants/themeAssets";
import { useLanguage } from "./Context/LanguageContext";
import { useAutoRotateResume } from "../hooks/useAutoRotateResume";

const Sectionsieben = ({ theme = "blue" }) => {
  const { lang } = useLanguage();
  const {
    autoRotate,
    handleInteractionStart,
    handleInteractionEnd,
    handleToggleRotation,
  } = useAutoRotateResume();
  const contentRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const interactionSrc = getAsset(theme, "interaction");
  const rotationLabel = autoRotate
    ? { en: "Stop rotation" }
    : { en: "Start rotation" };

  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(contentRef.current, { x: 180, opacity: 0 });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting || hasAnimatedRef.current) return;

          hasAnimatedRef.current = true;
          gsap.to(contentRef.current, {
            x: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
          });

          observer.disconnect();
        },
        { threshold: 0.25 }
      );

      observer.observe(contentRef.current);

      return () => observer.disconnect();
    }, contentRef);

    return () => ctx.revert();
  }, []);

  const t = (value) => {
    if (typeof value === "string") return value;
    if (!value) return "";
    return value[lang] ?? value.de ?? "";
  };

  return (
    <section id="sectionsieben" className="relative overflow-hidden">
      <div ref={contentRef} className="flex flex-col items-center gap-4">
        <button
          type="button"
          aria-pressed={autoRotate}
          aria-label={t(rotationLabel)}
          onClick={handleToggleRotation}
          className={`z-20 flex items-center gap-3 rounded-full bg-white/55 px-4 py-2 text-sm font-medium text-slate-900 shadow-md backdrop-blur-sm transition-opacity ${
            autoRotate ? "opacity-100" : "opacity-65"
          }`}
        >
          <img
            src={interactionSrc}
            alt=""
            className="w-10 md:w-12 lg:w-14"
          />
          <span>{t(rotationLabel)}</span>
        </button>

        <div className="hero-3d-layout relative w-full">
        <ModelMetastasen
          autoRotate={autoRotate}
          onInteractionStart={handleInteractionStart}
          onInteractionEnd={handleInteractionEnd}
        />
        </div>
      </div>
    </section>
  );
};

export default Sectionsieben;
