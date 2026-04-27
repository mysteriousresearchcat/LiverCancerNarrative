export const animationConfig = {
  hero: {
    // Hero.jsx
    textStagger: 0.1,
    introDuration: 1.8,
    indicatorDuration: 1,
    scrollJumpDuration: 1.2,
  },
  scrollTrigger: {
    // Global scrub smoothing for all pinned GSAP sections
    scrub: 1,
    // Uniform scroll distance for all panel-based sections
    panelEnd: "+=520%",
  },
  panel: {
    // Whole-panel slide/fade transitions in Thomas, Deutschland, Sectionneun, Sectionzehn, Sectionelf, etc.
    transitionDuration: 2.4,
    // How long a fully visible panel should linger before the next transition starts
    holdDuration: 0.45,
    // Staggered card/icon reveal duration in Sectionacht and Sectionvierzehn
    staggerDuration: 0.9,
    // Delay between staggered items in Sectionacht, Sectionvierzehn, Sectiondreizehn
    staggerDelay: 0.2,
    // Timeline overlap presets between outgoing and incoming content
    overlapTight: "-=0.1",
    overlapNormal: "-=0.15",
    overlapLoose: "-=0.2",
  },
  reveal: {
    // Smaller internal reveals like stats/items in Sectiondreizehn and Sectionfuenfzehn
    defaultDuration: 0.4,
    smallStepDuration: 0.25,
  },
};
