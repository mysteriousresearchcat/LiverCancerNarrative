import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import React, { useMemo } from "react";
import { SplitText } from "gsap/all";
import { getAsset } from "../../constants/themeAssets"; // Pfad ok?
import { useLanguage } from "./Context/LanguageContext"; // anpassen falls dein Pfad anders ist
import { animationConfig } from "../lib/animationConfig";

const Hero = ({
  theme = "blue",

  // Option A: {de,en} ODER string
  title,
  subtitle,
  author,
  scrollText,

  scrollTarget = "#thomas",
}) => {
  const { lang } = useLanguage();

  const t = useMemo(() => {
    return (value) => {
      if (typeof value === "string") return value;
      if (!value) return "";
      return value[lang] ?? value.de ?? "";
    };
  }, [lang]);

  useGSAP(() => {
    let cancelled = false;
    let cleanup = () => {};

    const runAnimation = () => {
      const ctx = gsap.context(() => {
        const heroSplit = new SplitText(".title", { type: "lines" });
        const paragraphSplit = new SplitText(".subtitle", { type: "lines" });

        gsap.from(heroSplit.lines, {
          yPercent: 150,
          duration: animationConfig.hero.introDuration,
          ease: "expo.out",
          stagger: animationConfig.hero.textStagger,
        });

        gsap.from(paragraphSplit.lines, {
          opacity: 0,
          yPercent: 150,
          duration: animationConfig.hero.introDuration,
          ease: "expo.out",
          stagger: animationConfig.hero.textStagger,
          delay: 1,
        });

        gsap.to(".scroll-indicator", {
          y: 10,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          duration: animationConfig.hero.indicatorDuration,
          delay: 2,
        });
      });

      cleanup = () => ctx.revert();
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) runAnimation();
      });
    } else {
      runAnimation();
    }

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [lang]);

  const scrollToDefinition = () => {
    gsap.to(window, {
      scrollTo: scrollTarget,
      duration: animationConfig.hero.scrollJumpDuration,
      ease: "power2.inOut",
    });
  };

  const lineSrc = getAsset(theme, "line"); // theme-only

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center"
    >
      <div className="flex flex-col items-center justify-center pb-24 text-center">
        <h1 className="title max-w-[10ch] text-center ">
          {t(title)}
        </h1>

        <img src={lineSrc} alt="Decorative line" className="mt-4" />

        <h3 className="subtitle !text-2xl sm:!text-3xl md:!text-4xl lg:!text-4xl">
          {t(subtitle)}
        </h3>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <p
          className="subtitle scroll-indicator cursor-pointer text-sm sm:text-base md:text-lg"
          onClick={scrollToDefinition}
        >
          {t(scrollText)}
        </p>
        <span
          className="scroll-indicator text-xl sm:text-2xl cursor-pointer"
          onClick={scrollToDefinition}
          aria-hidden="true"
        >
          &darr;
        </span>
      </div>
    </section>
  );
};

export default Hero;
