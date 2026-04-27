import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import gsap from "gsap";
import { useSearchParams } from "react-router-dom";
import { narratives, componentMap } from "../constants/narratives";
import { sectionGroupsByVersion } from "../constants";
import { ScrollTrigger, SplitText } from "gsap/all";
import Navbar from "./components/Navbar";
import {
  allocateSharedCondition,
  getSharedAllocatorApiUrl,
  installAllocatorDebugApi,
  resetAllocatorState,
  resolveConditionAllocation,
} from "./lib/conditionAllocator";

gsap.registerPlugin(ScrollTrigger, SplitText);

const SOSCI_SURVEY_URL = "https://befragungen.ovgu.de/LiverCancer/";
const VALID_VERSIONS = ["A", "B", "C"];
const VALID_THEMES = ["blue", "green", "red"];
const IS_DEV = import.meta.env.DEV;
const SHARED_ALLOCATOR_API_URL = getSharedAllocatorApiUrl();

const CONDITIONS = [
  { cond: "1", version: "A", theme: "blue" },
  { cond: "2", version: "A", theme: "green" },
  { cond: "3", version: "A", theme: "red" },
  { cond: "4", version: "B", theme: "blue" },
  { cond: "5", version: "B", theme: "green" },
  { cond: "6", version: "B", theme: "red" },
  { cond: "7", version: "C", theme: "blue" },
  { cond: "8", version: "C", theme: "green" },
  { cond: "9", version: "C", theme: "red" },
];

function getConditionByCond(rawCond) {
  const cond = String(rawCond || "").trim();
  return CONDITIONS.find((entry) => entry.cond === cond) || null;
}

function getOrCreateLocalPid() {
  const key = "local_pid";
  let pid = localStorage.getItem(key);
  if (!pid) {
    pid = `LOCAL_${crypto?.randomUUID?.() || Math.random().toString(16).slice(2)}`;
    localStorage.setItem(key, pid);
  }
  return pid;
}

function buildSurveyReturnUrl(token, studyContext = {}) {
  if (!token) return SOSCI_SURVEY_URL;

  const url = new URL(SOSCI_SURVEY_URL);
  url.searchParams.set("i", token);

  const {
    cond,
    version,
    theme,
    pid,
    allocatorMode,
    allocationSource,
    allocatorBackend,
  } = studyContext;
  if (cond) url.searchParams.set("cond", cond);
  if (version) url.searchParams.set("version", version);
  if (theme) url.searchParams.set("theme", theme);
  if (pid) url.searchParams.set("pid", pid);
  if (allocatorMode) url.searchParams.set("allocator_mode", allocatorMode);
  if (allocationSource) url.searchParams.set("allocation_source", allocationSource);
  if (allocatorBackend) url.searchParams.set("allocator_backend", allocatorBackend);

  return url.toString();
}

const componentNameBySectionId = {
  leber: "Leber",
  organe: "Organe",
  sectionacht: "Sectionacht",
  sectionzehn: "Sectionzehn",
  sectionelf: "Sectionelf",
  sectiondreizehn: "Sectiondreizehn",
  sectionvierzehn: "Sectionvierzehn",
};

const App = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const lang = "en";

  const pidFromUrl =
    searchParams.get("PROLIFIC_PID") ||
    searchParams.get("pid") ||
    searchParams.get("num") ||
    searchParams.get("participant_id") ||
    searchParams.get("participant") ||
    "";
  const pid = pidFromUrl || (IS_DEV ? getOrCreateLocalPid() : "no_pid");

  const surveyToken =
    searchParams.get("i") ||
    searchParams.get("tk") ||
    searchParams.get("token") ||
    searchParams.get("t") ||
    "";
  const urlVersionRaw = (searchParams.get("version") || "").toUpperCase();
  const urlThemeRaw = (searchParams.get("theme") || "").toLowerCase();
  const urlCondRaw = searchParams.get("cond") || "";
  const allocatorModeParam = (searchParams.get("allocator") || "hash").toLowerCase();
  const allocatorMode = allocatorModeParam === "quota" ? "quota" : "hash";
  const shouldResetAllocator = searchParams.get("allocator_reset") === "1";
  const usesSharedAllocator = allocatorMode === "quota" && Boolean(SHARED_ALLOCATOR_API_URL);

  const hasValidVersion = VALID_VERSIONS.includes(urlVersionRaw);
  const hasValidTheme = VALID_THEMES.includes(urlThemeRaw);
  const conditionFromUrl = useMemo(() => getConditionByCond(urlCondRaw), [urlCondRaw]);
  const hasValidCond = Boolean(conditionFromUrl);

  const [allocation, setAllocation] = useState(() => {
    if (shouldResetAllocator) {
      resetAllocatorState(CONDITIONS);
    }

    if (hasValidCond) {
      return null;
    }

    if (usesSharedAllocator) {
      return null;
    }

    return resolveConditionAllocation({
      pid,
      conditions: CONDITIONS,
      mode: allocatorMode,
    });
  });
  const [allocationError, setAllocationError] = useState("");

  useEffect(() => {
    installAllocatorDebugApi(CONDITIONS);
  }, []);

  useEffect(() => {
    if (shouldResetAllocator) {
      resetAllocatorState(CONDITIONS);
    }

    if (hasValidCond) {
      setAllocation(null);
      setAllocationError("");
      return;
    }

    if (!usesSharedAllocator) {
      setAllocation(
        resolveConditionAllocation({
          pid,
          conditions: CONDITIONS,
          mode: allocatorMode,
        })
      );
      setAllocationError("");
      return;
    }

    let cancelled = false;
    setAllocation(null);
    setAllocationError("");

    allocateSharedCondition(pid, CONDITIONS)
      .then((nextAllocation) => {
        if (cancelled) return;
        setAllocation(nextAllocation);
      })
      .catch((error) => {
        if (cancelled) return;

        setAllocation(
          resolveConditionAllocation({
            pid,
            conditions: CONDITIONS,
            mode: allocatorMode,
          })
        );
        setAllocationError(error.message || "Shared allocator unavailable");
      });

    return () => {
      cancelled = true;
    };
  }, [allocatorMode, hasValidCond, pid, shouldResetAllocator, usesSharedAllocator]);

  const hashAssigned = resolveConditionAllocation({
    pid,
    conditions: CONDITIONS,
    mode: "hash",
  }).condition;
  const assigned = allocation?.condition || (!usesSharedAllocator ? hashAssigned : null);
  const allocationMode = allocation?.mode || "hash";
  const allocationSource = allocation?.source || "pid_hash";
  const allocationBackend = allocation?.backend || (usesSharedAllocator ? "shared_api" : "local");
  const awaitingSharedAllocation =
    !hasValidCond && usesSharedAllocator && allocation === null && !allocationError;
  const sharedAllocatorExhausted =
    !hasValidCond && usesSharedAllocator && allocation?.exhausted && !allocation?.condition;

  if (awaitingSharedAllocation) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        <div className="max-w-xl">
          <h1 className="text-3xl font-semibold">Preparing your study version...</h1>
          <p className="mt-4 text-lg">
            Your condition is being assigned. This should only take a moment.
          </p>
        </div>
      </main>
    );
  }

  if (sharedAllocatorExhausted) {
    const fullStudyReturnUrl = buildSurveyReturnUrl(surveyToken, {
      pid,
      allocatorMode: allocationMode,
      allocationSource,
      allocatorBackend: allocationBackend,
    });

    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold">This study is currently full.</h1>
          <p className="mt-4 text-lg">
            All remaining condition slots have already been assigned.
          </p>
          {fullStudyReturnUrl ? (
            <a
              href={fullStudyReturnUrl}
              className="mt-8 inline-flex items-center justify-center rounded-full border border-white/40 bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
            >
              Return to the questionnaire
            </a>
          ) : null}
        </div>
      </main>
    );
  }

  const activeCondition =
    conditionFromUrl ||
    (IS_DEV && (hasValidVersion || hasValidTheme)
      ? {
          cond: (assigned || hashAssigned).cond,
          version: hasValidVersion ? urlVersionRaw : (assigned || hashAssigned).version,
          theme: hasValidTheme ? urlThemeRaw : (assigned || hashAssigned).theme,
        }
      : assigned || hashAssigned);

  const { version, theme, cond } = activeCondition;
  const surveyReturnUrl = useMemo(
    () =>
      buildSurveyReturnUrl(surveyToken, {
        cond,
        version,
        theme,
        pid,
        allocatorMode: allocationMode,
        allocationSource,
        allocatorBackend: allocationBackend,
      }),
    [
      allocationBackend,
      allocationMode,
      allocationSource,
      cond,
      pid,
      surveyToken,
      theme,
      version,
    ]
  );

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    let changed = false;

    if (IS_DEV && !searchParams.get("pid")) {
      next.set("pid", pid);
      changed = true;
    }

    if (IS_DEV) {
      if (!hasValidCond && assigned) {
        next.set("cond", assigned.cond);
        changed = true;
      }
      if (!hasValidVersion) {
        next.set("version", version);
        changed = true;
      }
      if (!hasValidTheme) {
        next.set("theme", theme);
        changed = true;
      }
    } else {
      if (next.has("version")) {
        next.delete("version");
        changed = true;
      }
      if (next.has("theme")) {
        next.delete("theme");
        changed = true;
      }
    }

    if (next.has("allocator_reset")) {
      next.delete("allocator_reset");
      changed = true;
    }

    if (changed) {
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    assigned,
    hasValidCond,
    hasValidTheme,
    hasValidVersion,
    pid,
    searchParams,
    setSearchParams,
    theme,
    version,
  ]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.remove("theme-blue", "theme-green", "theme-red");
    body.classList.remove("theme-blue", "theme-green", "theme-red");
    root.classList.add(`theme-${theme}`);
    body.classList.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    sessionStorage.setItem(
      "study_context",
      JSON.stringify({
        cond,
        version,
        theme,
        pid,
        surveyToken,
        allocationBackend,
        allocatorMode: allocationMode,
        allocationSource,
      })
    );
  }, [
    allocationBackend,
    allocationMode,
    allocationSource,
    cond,
    pid,
    surveyToken,
    theme,
    version,
  ]);

  const selectedNarrative = narratives[version] || narratives.A;
  const sectionGroups = sectionGroupsByVersion[version] || sectionGroupsByVersion.A;
  const chapterIntroNames = useMemo(() => {
    return new Set(
      Object.values(sectionGroups)
        .map((sections) => sections[0])
        .map((sectionId) => componentNameBySectionId[sectionId])
        .filter(Boolean)
    );
  }, [sectionGroups]);

  return (
    <main>
      {allocationError ? (
        <div className="px-4 py-3 text-center text-sm text-amber-200 bg-amber-950/60">
          Shared allocator unavailable. Falling back to browser-local quota mode for this session.
        </div>
      ) : null}
      <Navbar version={version} theme={theme} />

      {selectedNarrative.map((section, index) => {
        const Component = componentMap[section.name];
        if (!Component) return null;

        return (
          <Component
            key={`${section.name}-${index}`}
            theme={theme}
            version={version}
            pid={pid}
            cond={cond}
            surveyToken={surveyToken}
            surveyReturnUrl={surveyReturnUrl}
            chapterIntro={chapterIntroNames.has(section.name)}
            {...section.props}
          />
        );
      })}
    </main>
  );
};

export default App;
