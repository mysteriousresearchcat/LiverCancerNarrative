export const navTitles = {
  definition: "Definition",
  anatomie: "Anatomy",
  symptome: "Symptoms",
  diagnose: "Diagnosis",
  behandlung: "Treatment",
  prognose: "Prognosis",
  prävention: "Prevention",
};

export const sectionGroupsByVersion = {
  A: {
    definition: ["leber", "deutschland"],
    anatomie: ["organe", "sectionsechs", "sectionsieben"],
    symptome: ["sectionacht", "sectionneun"],
    diagnose: ["sectionzehn"],
    behandlung: ["sectionelf", "sectionzwoelf"],
    prognose: ["sectiondreizehn"],
    prävention: ["sectionvierzehn"],
  },

  B: {
    definition: ["leber", "deutschland"],
    anatomie: ["organe", "sectionsechs", "sectionsieben"],
    symptome: ["sectionacht", "sectionneun"],
    diagnose: ["sectionzehn"],
    behandlung: ["sectionelf", "sectionzwoelf"],
    prognose: ["sectiondreizehn"],
    prävention: ["sectionvierzehn"],
  },

  C: {
    definition: ["leber", "deutschland"],
    anatomie: ["organe", "sectionsechs", "sectionsieben"],
    symptome: ["sectionacht", "sectionneun"],
    diagnose: ["sectionzehn"],
    behandlung: ["sectionelf", "sectionzwoelf"],
    prognose: ["sectiondreizehn"],
    prävention: ["sectionvierzehn"],
  },
};

export const navLinksByVersion = Object.fromEntries(
  Object.entries(sectionGroupsByVersion).map(([ver, groups]) => {
    const links = Object.keys(groups).map((id) => ({
      id,
      title: navTitles[id] ?? id,
    }));
    return [ver, links];
  })
);

export const navLinks = navLinksByVersion.A;
