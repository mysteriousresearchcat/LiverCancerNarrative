import { sectionGroupsByVersion } from "./index"; 

import Hero from "../src/components/Hero";
import Thomas from "../src/components/Thomas";
import Leber from "../src/components/Leber";
import Deutschland from "../src/components/Deutschland";
import Organe from "../src/components/Organe";
import Sectionsechs from "../src/components/Sectionsechs";
import Sectionsieben from "../src/components/Sectionsieben";
import Sectionacht from "../src/components/Sectionacht";
import Sectionneun from "../src/components/Sectionneun";
import Sectionzehn from "../src/components/Sectionzehn";
import Sectionelf from "../src/components/Sectionelf";
import Sectionzwoelf from "../src/components/Sectionzwoelf";
import Sectiondreizehn from "../src/components/Sectiondreizehn";
import Sectionvierzehn from "../src/components/Sectionvierzehn";
import Sectionfuenfzehn from "../src/components/Sectionfuenfzehn";


import ThomasIll from "../src/images/Thomas_ill.png";
import ThomasHealthy from "../src/images/Thomas_healthy.png";
import ThomasSick from "../src/images/Thomas_sick.png";
import ThomasAndDoctor from "/src/images/Thomas_and_doctor.png";

const ORDER_FIXED = ["hero","thomas","sectionfuenfzehn"]; 

function reorderNarrativeByGroups(narrativeArray, groups) {
  const byId = new Map(narrativeArray.map((s) => [s.name, s]));

  const idToName = {
    hero: "Hero",
    thomas: "Thomas",
    leber: "Leber",
    deutschland: "Deutschland",
    organe: "Organe",
    sectionsechs: "Sectionsechs",
    sectionsieben: "Sectionsieben",
    sectionacht: "Sectionacht",
    sectionneun: "Sectionneun",
    sectionzehn: "Sectionzehn",
    sectionelf: "Sectionelf",
    sectionzwoelf: "Sectionzwoelf",
    sectiondreizehn: "Sectiondreizehn",
    sectionvierzehn: "Sectionvierzehn",
    sectionfuenfzehn: "Sectionfuenfzehn",
  };

  const orderedNames = [
    idToName.hero,
    idToName.thomas, // ✅ FIX: always second
    ...Object.values(groups).flat().map((id) => idToName[id]),
    idToName.sectionfuenfzehn,
  ].filter(Boolean);

  const seen = new Set();
  const uniqueOrderedNames = orderedNames.filter((n) =>
    seen.has(n) ? false : (seen.add(n), true)
  );

  return uniqueOrderedNames
    .map((name) => byId.get(name))
    .filter(Boolean);
}
const components = {
  Hero,
  Thomas,
  Leber,
  Deutschland,
  Organe,
  Sectionsechs,
  Sectionsieben,
  Sectionacht,
  Sectionneun,
  Sectionzehn,
  Sectionelf,
  Sectionzwoelf,
  Sectiondreizehn,
  Sectionvierzehn,
  Sectionfuenfzehn,
};



export const narratives = {
A: [
  {
    name: "Hero",
    props: {
      title: { de: "Leberkrebs: Ein Überblick", en: "Liver Cancer: An Overview" },
      subtitle: { de: "Eine interaktive Geschichte", en: "An interactive story" },
      author: { de: "von LUISA FLAIG", en: "by LUISA FLAIG" },
      scrollText: { de: "zum Beginnen Scrollen", en: "Scroll to begin" },
      scrollTarget: "#definition",
    },
  },

  {
    name: "Thomas",
    props: {
      heading: { de: "Was bedeutet eine Leberkrebsdiagnose?", en: "What Does a Liver Cancer Diagnosis Mean?" },
      body: {
        de: "Thomas ist 52 Jahre alt. Bei einer Routineuntersuchung stellt sein Hausarzt erhöhte Leberwerte fest. Weitere Untersuchungen bringen Gewissheit: In seiner Leber haben sich mehrere Tumore gebildet, im übrigen Körper sind jedoch keine Metastasen nachweisbar.",
        en: "Thomas is 52 years old. During a routine check-up, his doctor finds elevated liver values. Further tests confirm the diagnosis: several tumors have formed in his liver, but no metastases are detectable in the rest of his body.",
      },
      imageSrc: ThomasIll,
      imageAlt: { de: "Thomas", en: "Thomas" },
    },
  },

  {
    name: "Leber",
    props: {
      heading: { de: "Was ist Leberkrebs?", en: "What Is Liver Cancer?" },
    },
  },

{
  name: "Deutschland",
  props: {
    p1Left: {
      de: "In Deutschland werden jährlich etwa 8.790 neue Fälle von Leberkrebs diagnostiziert.",
      en: "In Germany, about 8,790 new cases of liver cancer are diagnosed each year.",
    },
    p1Right: {
      de: "In den letzten 35 Jahren hat sich die Zahl der Neuerkrankungen verdoppelt – ein klarer Handlungsbedarf für Prävention und Früherkennung.",
      en: "Over the past 35 years, the number of new cases has doubled—highlighting a clear need for prevention and early detection.",
    },
    p2Left: {
      de: "Auffällig ist dabei das Geschlechterverhältnis: Männer sind dreimal häufiger betroffen als Frauen.",
      en: "What stands out is the gender ratio: men are affected about three times more often than women.",
    },

    // ✅ FIX
    p2ImageKey: "ratio",
    p2ImageAlt: { de: "Statistik", en: "Statistics" },

    p3Text: {
      de: "Das durchschnittliche Alter bei der Erstdiagnose von Leberkrebs unterscheidet sich leicht zwischen den Geschlechtern. Bei Männern liegt das Durchschnittsalter der Diagnose bei 69,9 Jahren, während es bei Frauen mit 72,1 Jahren geringfügig höher ist.",
      en: "The average age at first diagnosis differs slightly by gender. For men, the average age at diagnosis is 69.9 years, while for women it is slightly higher at 72.1 years.",
    },

    // ✅ NEW – theme-based placeholder image
    p3ImageKey: "age",
    p3ImageAlt: { de: "Altersverteilung", en: "Age distribution" },
  },
},

  {
    name: "Organe",
    props: {
      heading: { de: "Die Leber: ein besonderes Organ", en: "The Liver: A Special Organ" },
    },
  },

  {
    name: "Sectionsechs",
    props: {
      leftText: {
        de: "Die Leber ist das größte und wichtigste Organ zur Verdauung von Nahrung und zur Beseitigung von Giftstoffen.",
        en: "The liver is the largest and most important organ for digesting food and removing toxins.",
      },
      rightText: {
        de: "Sie befindet sich im rechten Oberbauch, unterhalb des Herzens. Sie wird durch ein ausgedehntes Netz von Blutgefäßen versorgt und entwässert.",
        en: "It is located in the upper right abdomen, below the heart. It is supplied and drained by an extensive network of blood vessels.",
      },
    },
  },

  {
    name: "Sectionsieben",
    props: {},
  },

  {
    name: "Sectionacht",
    props: {
      heading: { de: "Wie macht sich Leberkrebs bemerkbar?", en: "What Are the Symptoms of Liver Cancer?" },
      introText: {
        de: "Da die Leber nicht schmerzempfindlich ist, verursacht Leberkrebs in der Regel zunächst keine Symptome. Im fortgeschrittenen Stadium äußert sich Leberkrebs auf verschiedene Weise.",
        en: "Because the liver itself is not sensitive to pain, liver cancer usually causes no symptoms at first. At an advanced stage, it can present in different ways.",
      },
      items: [
        { assetKey: "scale", text: { de: "Abnehmen ohne Anstrengung", en: "Unintentional weight loss" } },
        { assetKey: "junkfood", text: { de: "Appetitlosigkeit", en: "Loss of appetite" } },
        { assetKey: "temperature", text: { de: "Erhöhte Temperatur", en: "Fever" } },
        { assetKey: "stroke", text: { de: "Schmerzen im Oberbauch", en: "Upper abdominal pain" } },
        { assetKey: "fatigue", text: { de: "Schwäche und Müdigkeit", en: "Weakness and fatigue" } },
        { assetKey: "weightgain", text: { de: "Schwellungen des Bauches", en: "Abdominal swelling" } },
        { assetKey: "nausea", text: { de: "Gelbe Hautverfärbung", en: "Yellowing of the skin (jaundice)" } },
      ],
    },
  },

  {
    name: "Sectionneun",
    props: {
      heading: { de: "Wie wird Leberkrebs diagnostiziert?", en: "How Is Liver Cancer Diagnosed?" },
      introRight: {
        de: "Die Diagnostik soll klären, wie weit die Erkrankung fortgeschritten ist.",
        en: "Diagnosis aims to determine how advanced the disease is.",
      },

      q1Text: { de: "1. Sind Tumore in der Leber vorhanden? Wenn ja, wie viele?", en: "1. Are there tumors in the liver? If so, how many?" },
      q1ImageAlt: { de: "Tumore in der Leber", en: "Tumors in the liver" },

      methodsIntro: {
        de: "Zum Auffinden von Lebertumoren können verschiedene bildgebende Verfahren eingesetzt werden, darunter:",
        en: "To detect liver tumors, different imaging methods can be used, including:",
      },
      method1ImageKey: "ultraschall",
      method1Label: { de: "Ultraschall", en: "Ultrasound" },

      method2ImageKey: "CT",
      method2Label: { de: "CT", en: "CT scan" },

      method3ImageKey: "MRT",
      method3Label: { de: "MRT", en: "MRI" },

      q2Text: { de: "2. Wo genau befinden sich die Tumore?", en: "2. Where exactly are the tumors located?" },
      q2ImageAlt: { de: "Lage der Tumore", en: "Tumor location" },

      q3Text: { de: "3. Wie groß sind die Tumore?", en: "3. How large are the tumors?" },
      q3ImageAlt: { de: "Größe der Tumore", en: "Tumor size" },

      q4Text: { de: "4. Was ist der genaue Typ?", en: "4. What is the exact type?" },
      q4ImageAlt: { de: "Tumortyp", en: "Tumor type" },
    },
  },

  {
    name: "Sectionzehn",
    props: {
      heading: { de: "Wie wird Leberkrebs behandelt?", en: "How Is Liver Cancer Treated?" },

      l1Text: {
        de: "Die Behandlungsplanung hängt davon ab, wie weit die Krankheit  fortgeschritten ist und in welchem Zustand sich die Leber befindet.",
        en: "Treatment planning depends on how advanced the disease is and how well the liver is functioning.",
      },

      // ✅ theme-based: you said this needs an EN photo too → placeholder key
      l1ImageKey: "behandlung",
      l1ImageAlt: { de: "Behandlung", en: "Treatment" },

      l2LeftText: {
        de: "Außerdem spielen das Alter und der allgemeine Gesundheitszustand der Patienten eine wichtige Rolle. Abhängig davon gibt es heilende und lebensverlängernde Behandlungen.",
        en: "Age and overall health also matter. Depending on these factors, treatment may be curative or life-prolonging.",
      },
      l2RightText: {
        de: "Der Grad der Veränderung lässt sich nur durch eine mikroskopische Untersuchung der Krebszellen feststellen. Bei einer Biopsie wird eine kleine Probe des Lebergewebes entnommen und unter dem Mikroskop untersucht.",
        en: "The degree of cellular change can only be determined by examining cancer cells under a microscope. In a biopsy, a small sample of liver tissue is taken and analyzed.",
      },

      l3LeftText: {
        de: "Für die Therapieplanung ist es wichtig, das Ausmaß der Veränderung der Zellen zu verstehen. Der Schweregrad eines Tumors hängt davon ab, wie stark sich die Zellen bereits bösartig verändert haben.",
        en: "For treatment planning, it is important to understand how much the cells have changed. Tumor grade depends on how malignant the cells have become.",
      },

      // ✅ needs EN image → placeholder
      l3ImageKey: "biopsie",
      l3ImageAlt: { de: "Biopsie", en: "Biopsy" },

      l3Order: "textFirst",
    },
  },

  {
    name: "Sectionelf",
    props: {
      heading: { de: "Heilende Behandlung für Leberkrebs", en: "Curing Treatment for Liver Cancer" },

      l1RightText: {
        de: "Bei chirurgischen Eingriffen werden Teile der Leber, die Tumore enthalten, entfernt.",
        en: "In surgery, parts of the liver that contain tumors are removed.",
      },

      // ✅ needs EN image → placeholder
      l1ImageKey: "curative2",
      l1ImageAlt: { de: "Operation / Resektion", en: "Surgery / resection" },

      l2LeftText: {
        de: "Tumore können auch mit einer Ablation behandelt werden. Dabei wird eine Nadel in den Tumor eingeführt, durch die Hitze oder Mikrowellen geleitet werden, um den Tumor zu zerstören.",
        en: "Tumors can also be treated with ablation. A needle is inserted into the tumor and heat or microwaves are used to destroy it.",
      },

      // ✅ needs EN image → placeholder
      l2ImageKey: "curative3",
      l2ImageAlt: { de: "Ablation", en: "Ablation" },

      l3LeftText: {
        de: "Darüber hinaus können winzige, mit radioaktivem Material gefüllte Kügelchen in die Lebergefäße eingebracht werden. Der Tumor wird lokal von innen bestrahlt, was zum Absterben der Tumorzellen führt.",
        en: "In addition, tiny beads filled with radioactive material can be placed into liver vessels. The tumor is irradiated locally from inside, causing tumor cells to die.",
      },

      // ✅ needs EN image → placeholder
      l3ImageKey: "curative4",
      l3ImageAlt: { de: "Interne Strahlentherapie", en: "Internal radiation therapy" },
    },
  },

  {
    name: "Sectionzwoelf",
    props: {
      heading: { de: "Lebensverlängernde Behandlung für Leberkrebs", en: "Life-Prolonging Treatment for Liver Cancer" },

      p1Text: {
        de: "Wenn keine Aussicht auf Heilung besteht, kann eine lebensverlängernde Therapie das Wachstum des Tumors verlangsamen und die Symptome lindern.",
        en: "If cure is not possible, life-prolonging treatment can slow tumor growth and relieve symptoms.",
      },

      p1Items: [
        { assetKey: "stroke", text: { de: "Schmerzen", en: "Pain" } },
        { assetKey: "liver", text: { de: "Übelkeit", en: "Nausea" } },
        { assetKey: "scale", text: { de: "Weiterer Gewichtsverlust", en: "Further weight loss" } },
      ],

      p2Text: {
        de: "Spezielle Chemotherapien verlangsamen das Tumorwachstum. Schmerzmittel und kalorienreiches Essen reduzieren die Symptome.",
        en: "Specific chemotherapy regimens can slow tumor growth. Pain medication and high-calorie foods can help reduce symptoms.",
      },

      p2Items: [
        { assetKey: "infusion", text: { de: "Chemotherapie", en: "Chemotherapy" } },
        { assetKey: "medication", text: { de: "Schmerzmittel", en: "Pain medication" } },
        { assetKey: "junkfood", text: { de: "Kalorienreiches Essen", en: "High-calorie food" } },
      ],
    },
  },

  {
    name: "Sectiondreizehn",
    props: {
      heading: { de: "Prognose von Leberkrebs", en: "Prognosis of Liver Cancer" },

      l1Text1: { de: "Das hängt vom Stadium des Krebses und dem Zustand der Leber ab.", en: "It depends on the stage of the cancer and the condition of the liver." },
      l1Text2: { de: "5 Jahres Überlebensrate:", en: "5-year survival rate:" },
      l1Rate: "18%",
      l1RateImageKey: "manandwoman",
      l1RateImageAlt: { de: "Mann und Frau", en: "Man and woman" },

      step1Label: { de: "Tumor entfernt:", en: "Tumor removed:" },

      step2Text: {
        de: "Stadium I Tumore (einzelne Tumore, ohne Befall der Blutgefäße oder Lymphknoten und ohne Fernmetastasen)",
        en: "Stage I tumors (single tumors without involvement of blood vessels or lymph nodes and without distant metastases)",
      },
      step2FemaleRate: "54%",
      step2FemaleIconKey: "woman",
      step2FemaleIconAlt: { de: "Frau", en: "Woman" },
      step2MaleRate: "62%",
      step2MaleIconKey: "man",
      step2MaleIconAlt: { de: "Mann", en: "Man" },

      step3Text: { de: "Stadium IV Tumore (Lymphknotenbefall oder Fernmetastasen)", en: "Stage IV tumors (lymph node involvement or distant metastases)" },
      step3Rate: "2%",
      step3IconKey: "manandwoman",
      step3IconAlt: { de: "Statistik", en: "Statistics" },
    },
  },

  {
    name: "Sectionvierzehn",
    props: {
      heading: { de: "Wie kann ich Leberkrebs vorbeugen?", en: "How Can I Prevent Liver Cancer?" },

      introText: { de: "Einige Risikofaktoren für Leberkrebs sind vermeidbar:", en: "Some risk factors for liver cancer are preventable:" },
      bullets: {
        de: ["Hepatitis B", "Alkoholkonsum", "Übergewicht", "Rauchen"],
        en: ["Hepatitis B", "Alcohol consumption", "Overweight", "Smoking"],
      },

      items: [
        { assetKey: "vaccine", text: { de: "Impfung gegen Hepatitis", en: "Hepatitis vaccination" } },
        { assetKey: "alcohol", text: { de: "Alkoholkonsum einschränken", en: "Reduce alcohol consumption" } },
        { assetKey: "scalewithweight", text: { de: "Gewicht in einem gesunden Bereich halten", en: "Maintain a healthy weight" } },
        { assetKey: "smoking", text: { de: "Aufhören zu rauchen", en: "Quit smoking" } },
      ],
    },
  },

  {
    name: "Sectionfuenfzehn",
    props: {
      heading: { de: "Das Ergebnis von Thomas's Geschichte", en: "The Outcome of Thomas’s Story" },

      l1Text: {
        de: "Thomas steht am Anfang seiner Reise mit der Diagnose Leberkrebs. Sein Leben wird sich grundlegend verändern, denn gemeinsam mit seinem Arzt muss er nun eine passende Behandlungsmethode wählen und sich zugleich mit der Frage auseinandersetzen, wie sein zukünftiger Lebensstil aussehen soll.",
        en: "Thomas is at the beginning of his journey with a liver cancer diagnosis. His life will change profoundly: together with his doctor, he now has to choose a suitable treatment approach and also consider what his future lifestyle might look like.",
      },

      l2LeftText: {
        de: "Ein Leben mit Krebs bringt viele Herausforderungen mit sich. Umso wichtiger ist es, dass Thomas die Unterstützung in Anspruch nimmt, die er auf diesem Weg braucht.",
        en: "Living with cancer brings many challenges. That makes it all the more important that Thomas seeks the support he needs along the way.",
      },

      l2ImageSrc: ThomasAndDoctor,
      l2ImageAlt: { de: "Thomas und Arzt", en: "Thomas and doctor" },
    },
  },
],

B: [
  {
    name: "Hero",
    props: {
      title: { de: "Leberkrebs und mögliche Chancen", en: "Liver Cancer and Possible Chances" },
      subtitle: { de: "Eine interaktive Geschichte", en: "An Interactive Story" },
      author: { de: "von LUISA FLAIG", en: "by LUISA FLAIG" },
      scrollText: { de: "zum Beginnen Scrollen", en: "Scroll to Begin" },
      scrollTarget: "#definition", // (bei dir ggf. "#thomas" – je nach Hero-Komponente)
    },
  },

  {
    name: "Thomas",
    props: {
      heading: { de: "Wie findet man zurück ins Lebens?", en: "How do you find your way back to life?" },
      body: {
        de: "Thomas ist 52 Jahre alt. Bei einer Routineuntersuchung stellt sein Hausarzt erhöhte Leberwerte fest. Weitere Untersuchungen bringen Gewissheit: In seiner Leber haben sich mehrere Tumore gebildet, im übrigen Körper sind jedoch keine Metastasen nachweisbar.",
        en: "Thomas is 52 years old. During a routine check-up, his doctor notices elevated liver values. Further tests confirm the diagnosis: several tumors have formed in his liver, but no metastases are detected elsewhere in the body.",
      },

      panel2Variant: "textImage",
      panel2Text: {
        de: "Thomas wird klar, dass diese frühe Entdeckung ihm neue Chancen eröffnet. Zum ersten Mal stellt er sich aktiv die Frage, wie er sein Leben und seine Gesundheit bewusst neu gestalten kann.",
        en: "Thomas realizes that this early discovery opens up new possibilities. For the first time, he actively asks himself how he can consciously reshape his life and health.",
      },
      panel2ImageSrc: ThomasIll, // bleibt erstmal gleich (du wolltest Bilder später machen)
      panel2ImageAlt: { de: "Thomas", en: "Thomas" },
    },
  },

  {
    name: "Leber",
    props: {
      heading: { de: "Was ist Leberkrebs?", en: "What is liver cancer?" },
    },
  },

  {
    name: "Deutschland",
    props: {
      p1Left: {
        de: "Thomas ist einer von jährlich etwa 8.790 neuen Fällen von diagnostiziertem Leberkrebs in Deutschland.",
        en: "Thomas is one of around 8,790 newly diagnosed cases of liver cancer in Germany each year.",
      },
      p1Right: {
        de: "Besorgniserregend ist die Entwicklung der Fallzahlen über die Zeit. In den letzten 35 Jahren hat sich die Anzahl der jährlichen Neuerkrankungen bei Männern und Frauen verdoppelt. Die steigenden Fallzahlen der vergangenen Jahrzehnte verdeutlichen, wie wichtig Prävention und Früherkennung sind.",
        en: "The trend over time is concerning: over the last 35 years, the annual number of new cases in both men and women has doubled. This rise highlights how important prevention and early detection are.",
      },
      p2Left: {
        de: "Auffällig ist dabei das Geschlechterverhältnis: Männer sind dreimal häufiger betroffen als Frauen.",
        en: "A striking aspect is the gender ratio: men are affected three times more often than women.",
      },

      // Theme-based image key
      p2ImageKey: "ratio",
      p2ImageAlt: { de: "Statistik", en: "Statistics" },

    p3Text: {
      de: "Das durchschnittliche Alter bei der Erstdiagnose von Leberkrebs unterscheidet sich leicht zwischen den Geschlechtern. Bei Männern liegt das Durchschnittsalter der Diagnose bei 69,9 Jahren, während es bei Frauen mit 72,1 Jahren geringfügig höher ist.",
      en: "The average age at first diagnosis differs slightly by gender. For men, the average age at diagnosis is 69.9 years, while for women it is slightly higher at 72.1 years.",
    },

    // ✅ NEW – theme-based placeholder image
    p3ImageKey: "age",
    p3ImageAlt: { de: "Altersverteilung", en: "Age distribution" },
    },
  },

  {
    name: "Organe",
    props: {
      heading: { de: "Die Leber: ein besonderes Organ", en: "The liver: a special organ" },
    },
  },

  {
    name: "Sectionsechs",
    props: {
      leftText: {
        de: "Thomas erfährt, dass die Leber das größte und wichtigste Organ für die Verdauung von Nahrung und die Beseitigung von Giftstoffen ist. Ihm wird klar, welche Schlüsselrolle sie für seinen Körper spielt.",
        en: "Thomas learns that the liver is the largest and one of the most important organs for digesting food and removing toxins. He realizes how central it is to his body.",
      },
      rightText: {
        de: "Sie befindet sich im rechten Oberbauch, unterhalb des Herzens. Sie wird durch ein ausgedehntes Netz von Blutgefäßen versorgt und entwässert.",
        en: "It is located in the upper right abdomen, beneath the heart. It is supplied and drained by an extensive network of blood vessels.",
      },
    },
  },

  { name: "Sectionsieben", props: {} },

  {
    name: "Sectionacht",
    props: {
      heading: { de: "Wie macht sich Leberkrebs bemerkbar?", en: "How does liver cancer present itself?" },
      introText: {
        de: "Da die Leber nicht schmerzempfindlich ist, verursacht der Leberkrebs zunächst keine Symptome bei Thomas. Im fortgeschrittenen Stadium äußert sich der Leberkrebs auf unterschiedliche Weise, die er rückblickend als Warnsignale erkennt.",
        en: "Because the liver does not feel pain, liver cancer often causes no symptoms at first. At a later stage, it can show up in different ways that Thomas later recognizes as warning signs.",
      },

      items: [
        { assetKey: "scale", text: { de: "Abnehmen ohne Anstrengung", en: "Unintentional weight loss" } },
        { assetKey: "junkfood", text: { de: "Appetitlosigkeit", en: "Loss of appetite" } },
        { assetKey: "temperature", text: { de: "Erhöhte Temperatur", en: "Elevated temperature" } },
        { assetKey: "stroke", text: { de: "Schmerzen im Oberbauch", en: "Upper abdominal pain" } },
        { assetKey: "fatigue", text: { de: "Schwäche und Müdigkeit", en: "Weakness and fatigue" } },
        { assetKey: "weightgain", text: { de: "Schwellungen des Bauches", en: "Abdominal swelling" } },
        { assetKey: "nausea", text: { de: "Gelbe Hautverfärbung", en: "Yellowing of the skin" } },
      ],
    },
  },

  {
    name: "Sectionneun",
    props: {
      heading: { de: "Wie wird Leberkrebs diagnostiziert?", en: "How is liver cancer diagnosed?" },
      introRight: {
        de: "Die Diagnostik soll klären, wie weit die Erkrankung fortgeschritten ist. Thomas ist zuversichtlich, denn der behandelnde Arzt bespricht alles Schritt für Schritt mit ihm.",
        en: "Diagnostics aim to determine how advanced the disease is. Thomas feels reassured because his doctor explains everything step by step.",
      },

      q1Text: { de: "1. Sind Tumore in der Leber vorhanden? Wenn ja, wie viele?", en: "1. Are there tumors in the liver? If so, how many?" },
      q1ImageAlt: { de: "Tumore in der Leber", en: "Tumors in the liver" },

      methodsIntro: {
        de: "Zum Auffinden von Lebertumoren können verschiedene bildgebende Verfahren eingesetzt werden, darunter:",
        en: "Different imaging methods can be used to detect liver tumors, including:",
      },
      method1ImageKey: "ultraschall",
      method1Label: { de: "Ultraschall", en: "Ultrasound" },

      method2ImageKey: "CT",
      method2Label: { de: "CT", en: "CT" },

      method3ImageKey: "MRT",
      method3Label: { de: "MRT", en: "MRI" },

      q2Text: { de: "2. Wo genau befinden sich die Tumore?", en: "2. Where exactly are the tumors located?" },
      q2ImageAlt: { de: "Lage der Tumore", en: "Tumor location" },

      q3Text: { de: "3. Wie groß sind die Tumore?", en: "3. How large are the tumors?" },
      q3ImageAlt: { de: "Größe der Tumore", en: "Tumor size" },

      q4Text: { de: "4. Was ist der genaue Typ?", en: "4. What is the exact type?" },
      q4ImageAlt: { de: "Tumortyp", en: "Tumor type" },
    },
  },

  {
    name: "Sectionzehn",
    props: {
      heading: { de: "Wie wird Leberkrebs behandelt?", en: "How is liver cancer treated?" },

      l1Text: {
        de: "Thomas erfährt das sein Behandlungsplan davon abhängt, wie weit die Krankheit fortgeschritten ist und in welchem Zustand sich seine Leber befindet.",
        en: "Thomas learns that his treatment plan depends on how advanced the disease is and on the condition of his liver.",
      },

      // theme+lang asset (kommt aus themeAssets via getAsset(theme,key,lang))
      l1ImageKey: "behandlung",
      l1ImageAlt: { de: "Behandlung", en: "Treatment" },

      l2LeftText: {
        de: "Der Grad der Veränderung lässt sich nur durch eine mikroskopische Untersuchung der Krebszellen feststellen. Bei einer Biopsie wird eine kleine Probe des Lebergewebes entnommen und unter dem Mikroskop untersucht.",
        en: "The extent of cellular changes can only be determined by examining cancer cells under a microscope. In a biopsy, a small sample of liver tissue is taken and analyzed.",
      },
      l2RightText: {
        de: "Für die Therapieplanung ist es wichtig, das Ausmaß der Veränderung der Zellen zu verstehen. Der Schweregrad eines Tumors hängt davon ab, wie stark sich die Zellen bereits bösartig verändert haben.",
        en: "For treatment planning, it is important to understand how strongly the cells have changed. The aggressiveness of a tumor depends on how malignant the cellular changes are.",
      },

      l3LeftText: {
        de: "Dank seines Alters und seiner Anstrengungen bezüglich seines Gesundheitszustands bestehen gute Chancen auf eine heilende Behandlung. Daher entscheidet sich Thomas gemeinsam mit seinem Behandlungsteam für diesen Weg.",
        en: "Because of his age and the efforts he has made to improve his health, there is a good chance of curing treatment. Thomas and his care team therefore choose this path.",
      },

      // ✅ Platzhalter für EN-Bild (sprachabhängig)
      l3ImageKey: "biopsie",
      l3ImageAlt: { de: "Biopsie", en: "Biopsy" },

      l3Order: "imageFirst",
    },
  },

  {
    name: "Sectionelf",
    props: {
      heading: { de: "Heilende Behandlung für Leberkrebs", en: "Curing treatment for liver cancer" },

      l1RightText: {
        de: "Bei chirurgischen Eingriffen werden Teile der Leber, die Tumore enthalten, entfernt.",
        en: "In surgery, parts of the liver that contain tumors are removed.",
      },
      l1ImageKey: "curative2",
      l1ImageAlt: { de: "Operation / Resektion", en: "Surgery / Resection" },

      l2LeftText: {
        de: "Tumore können auch mit einer Ablation behandelt werden. Dabei wird eine Nadel in den Tumor eingeführt, durch die Hitze oder Mikrowellen geleitet werden, um den Tumor zu zerstören.",
        en: "Tumors can also be treated with ablation. A needle is inserted into the tumor and heat or microwaves are applied to destroy it.",
      },
      l2ImageKey: "curative3",
      l2ImageAlt: { de: "Ablation", en: "Ablation" },

      l3LeftText: {
        de: "Darüber hinaus können winzige, mit radioaktivem Material gefüllte Kügelchen in die Lebergefäße eingebracht werden. Der Tumor wird lokal von innen bestrahlt, was zum Absterben der Tumorzellen führt.",
        en: "In addition, tiny beads filled with radioactive material can be placed into liver vessels. The tumor is irradiated locally from the inside, which causes tumor cells to die.",
      },
      l3ImageKey: "curative4",
      l3ImageAlt: { de: "Interne Strahlentherapie", en: "Internal Radiation Therapy" },
    },
  },

  {
    name: "Sectionzwoelf",
    props: {
      heading: { de: "Lebensverlängernde Behandlung für Leberkrebs", en: "Life-prolonging treatment for liver cancer" },

      p1Text: {
        de: "Zu einer lebensverlängernden Behandlung möchte Thomas es nicht kommen lassen, da diese nur noch das Tumorwachstum verlangsamen und die Symptome lindern würde.",
        en: "Thomas hopes to avoid life-prolonging treatment, as it would only slow tumor growth and relieve symptoms.",
      },

      p1Items: [
        { assetKey: "stroke", text: { de: "Schmerzen", en: "Pain" } },
        { assetKey: "liver", text: { de: "Übelkeit", en: "Nausea" } },
        { assetKey: "scale", text: { de: "Weiterer Gewichtsverlust", en: "Further weight loss" } },
      ],

      p2Text: {
        de: "Spezielle Chemotherapien verlangsamen das Tumorwachstum. Schmerzmittel und kalorienreiches Essen reduzieren die Symptome.",
        en: "Specific chemotherapies can slow tumor growth. Pain medication and high-calorie foods can help reduce symptoms.",
      },

      p2Items: [
        { assetKey: "infusion", text: { de: "Chemotherapie", en: "Chemotherapy" } },
        { assetKey: "medication", text: { de: "Schmerzmittel", en: "Pain medication" } },
        { assetKey: "junkfood", text: { de: "Kalorienreiches Essen", en: "High-calorie food" } },
      ],
    },
  },

  {
    name: "Sectiondreizehn",
    props: {
      heading: { de: "Prognose von Leberkrebs", en: "Prognosis of liver cancer" },

      l1Text1: { de: "Das hängt vom Stadium des Krebses und dem Zustand der Leber ab.", en: "This depends on the cancer stage and the condition of the liver." },
      l1Text2: { de: "5 Jahres Überlebensrate:", en: "5-year survival rate:" },
      l1Rate: "18%",
      l1RateImageKey: "manandwoman",
      l1RateImageAlt: { de: "Mann und Frau", en: "Man and woman" },

      step1Label: { de: "Tumor entfernt:", en: "Tumor removed:" },

      step2Text: {
        de: "Stadium I Tumore (einzelne Tumore, ohne Befall der Blutgefäße oder Lymphknoten und ohne Fernmetastasen)",
        en: "Stage I tumors (single tumors without involvement of blood vessels or lymph nodes and without distant metastases)",
      },
      step2FemaleRate: "54%",
      step2FemaleIconKey: "woman",
      step2FemaleIconAlt: { de: "Frau", en: "Woman" },
      step2MaleRate: "62%",
      step2MaleIconKey: "man",
      step2MaleIconAlt: { de: "Mann", en: "Man" },

      step3Text: { de: "Stadium IV Tumore (Lymphknotenbefall oder Fernmetastasen)", en: "Stage IV tumors (lymph node involvement or distant metastases)" },
      step3Rate: "2%",
      step3IconKey: "manandwoman",
      step3IconAlt: { de: "Statistik", en: "Statistics" },
    },
  },

  {
    name: "Sectionvierzehn",
    props: {
      heading: { de: "Wie kann ich Leberkrebs vorbeugen?", en: "How can I prevent liver cancer?" },

      // ⚠️ dein DE-Text hat gerade einen Copy/Paste-Glitch – ich habe es sauber gemacht:
      introText: {
        de: "Im Gespräch mit seinem Arzt erfährt Thomas, dass viele Risikofaktoren für Leberkrebs beeinflussbar sind. Diese Erkenntnis verändert seinen Blick auf die eigene Gesundheit.",
        en: "In conversation with his doctor, Thomas learns that many risk factors for liver cancer can be influenced. This insight changes how he views his own health.",
      },

      bullets: [
        { de: "Hepatitis B", en: "Hepatitis B" },
        { de: "Alkoholkonsum", en: "Alcohol consumption" },
        { de: "Übergewicht", en: "Overweight" },
        { de: "Rauchen", en: "Smoking" },
      ],

      items: [
        { assetKey: "vaccine", text: { de: "Impfung gegen Hepatitis", en: "Vaccination against hepatitis" } },
        { assetKey: "alcohol", text: { de: "Alkoholkonsum einschränken", en: "Limit alcohol consumption" } },
        { assetKey: "scalewithweight", text: { de: "Gewicht in einem gesunden Bereich halten", en: "Maintain a healthy weight" } },
        { assetKey: "smoking", text: { de: "Aufhören zu rauchen", en: "Quit smoking" } },
      ],
    },
  },

  {
    name: "Sectionfuenfzehn",
    props: {
      heading: { de: "Das Ergebnis von Thomas's Geschichte", en: "The outcome of Thomas’s story" },

      l1Text: {
        de: "Nach der heilenden Behandlung zeigen die Nachuntersuchungen, dass der Krebs verschwunden ist. Thomas spürt Erleichterung und Zuversicht, da die Therapie erfolgreich war. Die Ärzte erklären ihm, dass regelmäßige Nachkontrollen und ein gesunder Lebensstil weiterhin wichtig sind, um die Chancen auf ein dauerhaft krebsfreies Leben zu sichern",
        en: "After curing treatment, follow-up examinations show that the cancer is gone. Thomas feels relieved and hopeful because the therapy was successful. His doctors explain that regular follow-ups and a healthy lifestyle remain important to maximize the chances of staying cancer-free long term.",
      },

      l2LeftText: {
        de: "Thomas achtet nun bewusst auf einen gesünderen Lebensstil, um einem möglichen Rückfall seines Krebses vorzubeugen.",
        en: "Thomas now consciously follows a healthier lifestyle to reduce the risk of recurrence.",
      },

      l2ExtraItems: [
        {
          iconKey: "smoking",
          text: {
            de: "Aufhören zu rauchen",
            en: "Quit smoking",
          },
          iconAlt: { de: "Nichtrauchen", en: "No smoking" },
        },
        {
          iconKey: "alcohol",
          text: {
            de: "Weniger Alkohol trinken",
            en: "Drink less alcohol",
          },
          iconAlt: { de: "Weniger Alkohol", en: "Less alcohol" },
        },
        {
          iconKey: "sport",
          text: {
            de: "Regelmäßig Sport treiben",
            en: "Exercise regularly",
          },
          iconAlt: { de: "Sport", en: "Sport" },
        },
      ],
      l2AltImageSrc: ThomasHealthy,
      l2AltImageAlt: { de: "Thomas gesund", en: "Thomas healthy" },
      l2ImageSrc: ThomasAndDoctor, // später ggf. EN-Variante
      l2ImageAlt: { de: "Thomas und Arzt", en: "Thomas and doctor" },
    },
  },
],

C: [
  {
    name: "Hero",
    props: {
      title: { de: "Leberkrebs und die Konsequenzen", en: "Liver Cancer and the Consequences" },
      subtitle: { de: "Eine interaktive Geschichte", en: "An interactive story" },
      author: { de: "von LUISA FLAIG", en: "by LUISA FLAIG" },
      scrollText: { de: "zum Beginnen Scrollen", en: "Scroll to Begin" },
      scrollTarget: "#definition",
    },
  },

  {
    name: "Thomas",
    props: {
      heading: { de: "Gibt es eine Chance auf Heilung?", en: "Is there a chance of a cure?" },
      body: {
        de: "Thomas ist 52 Jahre alt. Bei einer Routineuntersuchung stellt sein Hausarzt erhöhte Leberwerte fest. Weitere Untersuchungen bringen Gewissheit: In seiner Leber haben sich mehrere Tumore gebildet, im übrigen Körper sind jedoch keine Metastasen nachweisbar.",
        en: "Thomas is 52 years old. During a routine check-up, his doctor notices elevated liver values. Further tests confirm the diagnosis: several tumors have formed in his liver, but no metastases are detected elsewhere in the body.",
      },

      panel2Variant: "textImage",
      panel2Text: {
        de: "Zum ersten Mal wird Thomas bewusst, wie verletzlich seine Gesundheit ist. Er sieht sich mit der Frage konfrontiert, wie viel Kontrolle er überhaupt noch über sein Leben hat.",
        en: "For the first time, Thomas realizes how fragile his health is. He is confronted with the question of how much control he still has over his life.",
      },
      panel2ImageSrc: ThomasIll,
      panel2ImageAlt: { de: "Thomas", en: "Thomas" },
    },
  },

  {
    name: "Leber",
    props: {
      heading: { de: "Was ist Leberkrebs?", en: "What is liver cancer?" },
    },
  },

  {
    name: "Deutschland",
    props: {
      p1Left: {
        de: "Thomas ist einer von jährlich etwa 8.790 neu diagnostizierten Fällen in Deutschland.",
        en: "Thomas is one of around 8,790 newly diagnosed cases in Germany each year.",
      },
      p1Right: {
        de: "Besorgniserregend ist die Entwicklung der Fallzahlen über die Zeit. In den letzten 35 Jahren hat sich die Anzahl der jährlichen Neuerkrankungen bei Männern und Frauen verdoppelt. Die steigenden Fallzahlen der vergangenen Jahrzehnte verdeutlichen, wie fatal ein ungesunder Lebensstil und das Ausblenden von Risiken ist.",
        en: "The trend over time is concerning: over the last 35 years, the annual number of new cases in both men and women has doubled. The rise highlights how harmful an unhealthy lifestyle and ignoring risks can be.",
      },
      p2Left: {
        de: "Auffällig ist dabei das Geschlechterverhältnis: Männer sind dreimal häufiger betroffen als Frauen.",
        en: "A striking aspect is the gender ratio: men are affected three times more often than women.",
      },

      // ✅ FIX: Deutschland component expects p2ImageKey, not p2ImageSrc
      p2ImageKey: "ratio",
      p2ImageAlt: { de: "Statistik", en: "Statistics" },

    p3Text: {
      de: "Das durchschnittliche Alter bei der Erstdiagnose von Leberkrebs unterscheidet sich leicht zwischen den Geschlechtern. Bei Männern liegt das Durchschnittsalter der Diagnose bei 69,9 Jahren, während es bei Frauen mit 72,1 Jahren geringfügig höher ist.",
      en: "The average age at first diagnosis differs slightly by gender. For men, the average age at diagnosis is 69.9 years, while for women it is slightly higher at 72.1 years.",
    },

    // ✅ NEW – theme-based placeholder image
    p3ImageKey: "age",
    p3ImageAlt: { de: "Altersverteilung", en: "Age distribution" },
    },
  },

  {
    name: "Organe",
    props: {
      heading: { de: "Die Leber: ein besonderes Organ", en: "The liver: a special organ" },
    },
  },

  {
    name: "Sectionsechs",
    props: {
      leftText: {
        de: "Thomas hatte nie viel über die Leber nachgedacht, obwohl sie das größte und wichtigste Organ für die Verdauung von Nahrung und die Beseitigung von Giftstoffen ist.",
        en: "Thomas had never thought much about the liver, even though it is the largest and one of the most important organs for digesting food and removing toxins.",
      },
      rightText: {
        de: "Sie befindet sich im rechten Oberbauch, unterhalb des Herzens. Sie wird durch ein ausgedehntes Netz von Blutgefäßen versorgt und entwässert.",
        en: "It is located in the upper right abdomen, beneath the heart. It is supplied and drained by an extensive network of blood vessels.",
      },
    },
  },

  { name: "Sectionsieben", props: {} },

  {
    name: "Sectionacht",
    props: {
      heading: { de: "Wie macht sich Leberkrebs bemerkbar?", en: "How does liver cancer present itself?" },
      introText: {
        de: "Da die Leber nicht schmerzempfindlich ist, verursacht der Leberkrebs zunächst keine Symptome bei Thomas. Im fortgeschrittenen Stadium äußert sich der Leberkrebs auf unterschiedliche Weise, die er rückblickend als Warnsignale hätte wahrnehmen können.",
        en: "Because the liver does not feel pain, liver cancer often causes no symptoms at first. At a later stage, it can show up in different ways that Thomas could, in hindsight, have recognized as warning signs.",
      },

      items: [
        { assetKey: "scale", text: { de: "Abnehmen ohne Anstrengung", en: "Unintentional weight loss" } },
        { assetKey: "junkfood", text: { de: "Appetitlosigkeit", en: "Loss of appetite" } },
        { assetKey: "temperature", text: { de: "Erhöhte Temperatur", en: "Elevated temperature" } },
        { assetKey: "stroke", text: { de: "Schmerzen im Oberbauch", en: "Upper abdominal pain" } },
        { assetKey: "fatigue", text: { de: "Schwäche und Müdigkeit", en: "Weakness and fatigue" } },
        { assetKey: "weightgain", text: { de: "Schwellungen des Bauches", en: "Abdominal swelling" } },
        { assetKey: "nausea", text: { de: "Gelbe Hautverfärbung", en: "Yellowing of the skin" } },
      ],
    },
  },

  {
    name: "Sectionneun",
    props: {
      heading: { de: "Wie wird Leberkrebs diagnostiziert?", en: "How is liver cancer diagnosed?" },
      introRight: {
        de: "Die Diagnostik soll klären, wie weit die Erkrankung fortgeschritten ist. Für Thomas bedeutet jeder Untersuchungsschritt eine neue unangenehme Konfrontation mit seiner Situation.",
        en: "Diagnostics aim to determine how advanced the disease is. For Thomas, each step of the examination feels like another unpleasant confrontation with his situation.",
      },

      q1Text: { de: "1. Sind Tumore in der Leber vorhanden? Wenn ja, wie viele?", en: "1. Are there tumors in the liver? If so, how many?" },
      q1ImageAlt: { de: "Tumore in der Leber", en: "Tumors in the liver" },

      methodsIntro: {
        de: "Zum Auffinden von Lebertumoren können verschiedene bildgebende Verfahren eingesetzt werden, darunter:",
        en: "Different imaging methods can be used to detect liver tumors, including:",
      },

      // ✅ FIX: keys must match themeAssets.js
      method1ImageKey: "ultraschall",
      method1Label: { de: "Ultraschall", en: "Ultrasound" },

      method2ImageKey: "CT",
      method2Label: { de: "CT", en: "CT" },

      method3ImageKey: "MRT",
      method3Label: { de: "MRT", en: "MRI" },

      q2Text: { de: "2. Wo genau befinden sich die Tumore?", en: "2. Where exactly are the tumors located?" },
      q2ImageAlt: { de: "Lage der Tumore", en: "Tumor location" },

      q3Text: { de: "3. Wie groß sind die Tumore?", en: "3. How large are the tumors?" },
      q3ImageAlt: { de: "Größe der Tumore", en: "Tumor size" },

      q4Text: { de: "4. Was ist der genaue Typ?", en: "4. What is the exact type?" },
      q4ImageAlt: { de: "Tumortyp", en: "Tumor type" },
    },
  },

  {
    name: "Sectionzehn",
    props: {
      heading: { de: "Wie wird Leberkrebs behandelt?", en: "How is liver cancer treated?" },

      l1Text: {
        de: "Thomas erfährt das sein Behandlungsplan davon abhängt, wie weit die Krankheit fortgeschritten ist und in welchem Zustand sich seine Leber befindet.",
        en: "Thomas learns that his treatment plan depends on how advanced the disease is and on the condition of his liver.",
      },
      l1ImageKey: "behandlung",
      l1ImageAlt: { de: "Behandlung", en: "Treatment" },

      l2LeftText: {
        de: "Der Grad der Veränderung lässt sich nur durch eine mikroskopische Untersuchung der Krebszellen feststellen. Bei einer Biopsie wird eine kleine Probe des Lebergewebes entnommen und unter dem Mikroskop untersucht.",
        en: "The extent of cellular changes can only be determined by examining cancer cells under a microscope. In a biopsy, a small sample of liver tissue is taken and analyzed.",
      },
      l2RightText: {
        de: "Für die Therapieplanung ist es wichtig, das Ausmaß der Veränderung der Zellen zu verstehen. Der Schweregrad eines Tumors hängt davon ab, wie stark sich die Zellen bereits bösartig verändert haben.",
        en: "For treatment planning, it is important to understand how strongly the cells have changed. The aggressiveness of a tumor depends on how malignant the cellular changes are.",
      },

      l3LeftText: {
        de: "Trotz seines Alters ist der allgemeine Gesundheitszustand von Thomas durch seine fehlende Einsicht und Verdrängung schlecht. Thomas entscheidet sich gemeinsam mit den behandelnden Ärzten zunächst für eine heilende Therapie.",
        en: "Despite his age, Thomas’s overall health is poor due to denial and lack of insight. Together with his doctors, he initially opts for curative therapy.",
      },

      // ✅ Platzhalter für EN-Bild
      l3ImageKey: "biopsie",
      l3ImageAlt: { de: "Biopsie", en: "Biopsy" },

      l3Order: "imageFirst",
    },
  },

  {
  name: "Sectionelf",
  props: {
    heading: { de: "Heilende Behandlung für Leberkrebs", en: "Curing treatment for liver cancer" },

    l1RightText: {
      de: "Bei chirurgischen Eingriffen werden Teile der Leber, die Tumore enthalten, entfernt.",
      en: "During surgery, parts of the liver that contain tumors are removed.",
    },
    l1ImageKey: "curative2",
    l1ImageAlt: { de: "Operation / Resektion", en: "Surgery / Resection" },

    l2LeftText: {
      de: "Tumore können auch mit einer Ablation behandelt werden. Dabei wird eine Nadel in den Tumor eingeführt, durch die Hitze oder Mikrowellen geleitet werden, um den Tumor zu zerstören.",
      en: "Tumors can also be treated with ablation. A needle is inserted into the tumor and heat or microwaves are applied to destroy it.",
    },
    l2ImageKey: "curative3",
    l2ImageAlt: { de: "Ablation", en: "Ablation" },

    l3LeftText: {
      de: "Darüber hinaus können winzige, mit radioaktivem Material gefüllte Kügelchen in die Lebergefäße eingebracht werden. Der Tumor wird lokal von innen bestrahlt, was zum Absterben der Tumorzellen führt.",
      en: "In addition, tiny beads filled with radioactive material can be placed into liver vessels. This irradiates the tumor locally from the inside, causing tumor cells to die.",
    },
    l3ImageKey: "curative4",
    l3ImageAlt: { de: "Interne Strahlentherapie", en: "Internal Radiotherapy" },
  },
},

  {
    name: "Sectionzwoelf",
    props: {
      heading: { de: "Lebensverlängernde Behandlung für Leberkrebs", en: "Life-prolonging treatment for liver cancer" },

      p1Text: {
        de: "Da der Krebs bei Thomas nach der heilenden Behandlung zurückkomt, kann eine lebensverlängernde Therapie das Wachstum des Tumors nur noch verlangsamen und die Symptome lindern.",
        en: "Because Thomas’s cancer returns after curing treatment, life-prolonging treatment can only slow tumor growth and relieve symptoms.",
      },

      p1Items: [
        { assetKey: "stroke", text: { de: "Schmerzen", en: "Pain" } },
        { assetKey: "liver", text: { de: "Übelkeit", en: "Nausea" } },
        { assetKey: "scale", text: { de: "Weiterer Gewichtsverlust", en: "Further weight loss" } },
      ],

      p2Text: {
        de: "Spezielle Chemotherapien verlangsamen das Tumorwachstum. Schmerzmittel und kalorienreiches Essen reduzieren die Symptome.",
        en: "Specific chemotherapies can slow tumor growth. Pain medication and high-calorie foods can help reduce symptoms.",
      },

      p2Items: [
        { assetKey: "infusion", text: { de: "Chemotherapie", en: "Chemotherapy" } },
        { assetKey: "medication", text: { de: "Schmerzmittel", en: "Pain medication" } },
        { assetKey: "junkfood", text: { de: "Kalorienreiches Essen", en: "High-calorie food" } },
      ],
    },
  },

  {
    name: "Sectiondreizehn",
    props: {
      heading: { de: "Prognose von Leberkrebs", en: "Prognosis of liver cancer" },

      l1Text1: { de: "Das hängt vom Stadium des Krebses und dem Zustand der Leber ab.", en: "This depends on the cancer stage and the condition of the liver." },
      l1Text2: { de: "5 Jahres Überlebensrate:", en: "5-year survival rate:" },
      l1Rate: "18%",

      // ✅ FIX: use keys, not string filenames
      l1RateImageKey: "manandwoman",
      l1RateImageAlt: { de: "Mann und Frau", en: "Man and woman" },

      step1Label: { de: "Tumor entfernt:", en: "Tumor removed:" },

      step2Text: {
        de: "Stadium I Tumore (einzelne Tumore, ohne Befall der Blutgefäße oder Lymphknoten und ohne Fernmetastasen)",
        en: "Stage I tumors (single tumors without involvement of blood vessels or lymph nodes and without distant metastases)",
      },
      step2FemaleRate: "54%",
      step2FemaleIconKey: "woman",
      step2FemaleIconAlt: { de: "Frau", en: "Woman" },
      step2MaleRate: "62%",
      step2MaleIconKey: "man",
      step2MaleIconAlt: { de: "Mann", en: "Man" },

      step3Text: { de: "Stadium IV Tumore (Lymphknotenbefall oder Fernmetastasen)", en: "Stage IV tumors (lymph node involvement or distant metastases)" },
      step3Rate: "2%",
      step3IconKey: "manandwoman",
      step3IconAlt: { de: "Statistik", en: "Statistics" },
    },
  },

  {
    name: "Sectionvierzehn",
    props: {
      heading: { de: "Wie kann ich Leberkrebs vorbeugen?", en: "How can I prevent liver cancer?" },

      introText: {
        de: "Trotz vermeidbarer Risikofaktoren für Leberkrebs weigert sich Thomas, seinen ungesunden Lebensstil anzupassen.",
        en: "Despite avoidable risk factors for liver cancer, Thomas refuses to change his unhealthy lifestyle.",
      },

      bullets: [
        { de: "Hepatitis B", en: "Hepatitis B" },
        { de: "Alkoholkonsum", en: "Alcohol consumption" },
        { de: "Übergewicht", en: "Overweight" },
        { de: "Rauchen", en: "Smoking" },
      ],

      items: [
        { assetKey: "vaccine", text: { de: "Impfung gegen Hepatitis", en: "Vaccination against hepatitis" } },
        { assetKey: "alcohol", text: { de: "Alkoholkonsum einschränken", en: "Limit alcohol consumption" } },
        { assetKey: "scalewithweight", text: { de: "Gewicht in einem gesunden Bereich halten", en: "Maintain a healthy weight" } },
        { assetKey: "smoking", text: { de: "Aufhören zu rauchen", en: "Quit smoking" } },
      ],
    },
  },

  {
    name: "Sectionfuenfzehn",
    props: {
      heading: { de: "Das Ergebnis von Thomas's Geschichte", en: "The outcome of Thomas’s story" },

      l1Text: {
        de: "Trotz lebensverlängernder Behandlung ist der Leberkrebs bei Thomas nicht verschwunden. Sein Zustand bleibt instabil, und er fühlt sich im Alltag häufig erschöpft und krank. Rückblickend wird deutlich, dass eine frühzeitige Änderung seines Lebensstils seine Chancen auf einen günstigeren Krankheitsverlauf hätte verbessern können.",
        en: "Thomas’s condition remains unstable, and he often feels exhausted and unwell in everyday life. In hindsight, it becomes clear that an earlier change in lifestyle could have improved his chances of a more favorable course of disease.",
      },

      l2LeftText: {
        de: "Thomas lebt weiter mit der Erkrankung, aber sein Alltag ist stark von Beschwerden und Unsicherheit geprägt.",
        en: "Thomas continues to live with the disease, but his daily life is heavily shaped by symptoms and uncertainty.",
      },

      l2ExtraItems: [
        {
          iconKey: "smoking",
          text: {
            de: "Nicht aufgehört zu rauchen",
            en: "Did not quit smoking",
          },
          iconAlt: { de: "Weiter geraucht", en: "Continued smoking" },
        },
        {
          iconKey: "alcohol",
          text: {
            de: "Alkoholkonsum nicht reduziert",
            en: "Did not reduce alcohol consumption",
          },
          iconAlt: { de: "Alkohol nicht reduziert", en: "Alcohol not reduced" },
        },
        {
          iconKey: "sport",
          text: {
            de: "Keine nachhaltige Veränderung des Lebensstils",
            en: "No lasting lifestyle change",
          },
          iconAlt: { de: "Kein Sport", en: "No sport" },
        },
      ],
      l2AltImageSrc: ThomasSick,
      l2AltImageAlt: { de: "Thomas krank", en: "Thomas sick" },
      l2ImageSrc: ThomasAndDoctor,
      l2ImageAlt: { de: "Thomas und Arzt", en: "Thomas and doctor" },
    },
  },
],
};

narratives.B = reorderNarrativeByGroups(narratives.B, sectionGroupsByVersion.B);
narratives.C = reorderNarrativeByGroups(narratives.C, sectionGroupsByVersion.C);

export const componentMap = components;

