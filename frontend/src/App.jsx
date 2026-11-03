
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import DisabilitySelection from "./pages/DisabilitySelection";
import LearningPreferences from "./pages/LearningPreferences";
import DiagnosticQuiz from "./pages/DiagnosticQuiz";
import Dashboard from "./pages/Dashboard";
import Lessons from "./pages/Lessons";
import PracticeQuiz from "./pages/PracticeQuiz";
import ProgressTracking from "./pages/ProgressTracking";
import AccessibilityInitializer from "./utils/AccessibilityInitializer";
import AccessibilityControls from "./components/AccessibilityControls";
import ReadingAccessibility from "./components/ReadingAccessibility";
import Teacher from "./pages/Teacher";
import Admin from "./pages/Admin";
import AccessPortal from "./pages/AccessPortal";
import RoleGate from "./components/RoleGate";
import { useLanguage } from "./i18n";
import LanguageSwitcher from "./components/LanguageSwitcher";
import RoleSwitcher from "./components/RoleSwitcher";
import ThemeToggle from "./components/ThemeToggle";
import { useEffect } from "react";
import { translateDom } from "./i18n/domTranslations";

function App() {
  const lang = useLanguage();
  useEffect(() => {
    const marker = "zuno_clean_handoff_v1";
    if (localStorage.getItem(marker) !== "done") {
      const keep = new Set(["zuno_language", "zuno_theme", "zuno_user_role"]);
      const keysToClear = [];
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("neuralstorm_") || key.startsWith("zuno_")) && !keep.has(key)) keysToClear.push(key);
      }
      keysToClear.forEach(key => localStorage.removeItem(key));
      const sessionKeys = [];
      for (let i = 0; i < sessionStorage.length; i += 1) {
        const key = sessionStorage.key(i);
        if (key && (key.startsWith("neuralstorm_") || key.startsWith("zuno_"))) sessionKeys.push(key);
      }
      sessionKeys.forEach(key => sessionStorage.removeItem(key));
      localStorage.setItem(marker, "done");
    }
  }, []);
  useEffect(() => {
    translateDom(lang);
    const observer = new MutationObserver(() => translateDom(lang));
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [lang]);
  useEffect(() => {
    const applyTheme = () => { document.documentElement.dataset.theme = localStorage.getItem("zuno_theme") || "light"; };
    applyTheme();
    window.addEventListener("zuno-theme-change", applyTheme);
    return () => window.removeEventListener("zuno-theme-change", applyTheme);
  }, []);
  return (
    <><AccessibilityInitializer /><header className="app-utility-header"><div className="app-utility-inner"><LanguageSwitcher /><RoleSwitcher /><ThemeToggle /></div></header><div className="global-access-dock"><details><summary>Accessibility tools</summary><AccessibilityControls /><ReadingAccessibility /></details></div><Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/disability-selection"
        element={<DisabilitySelection />}
      />

      <Route
        path="/learning-preferences"
        element={<LearningPreferences />}
      />

      <Route
        path="/diagnostic-quiz"
        element={<DiagnosticQuiz />}
      />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/student" element={<Dashboard />} />
      <Route path="/staff-access" element={<AccessPortal />} />
      <Route path="/teacher" element={<RoleGate allow={["teacher"]}><Teacher /></RoleGate>} />
      <Route path="/admin" element={<RoleGate allow={["admin"]}><Admin /></RoleGate>} />

      <Route path="/lessons" element={<Lessons />} />

      <Route path="/practice" element={<PracticeQuiz />} />

      <Route path="/progress" element={<ProgressTracking />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes></>
  );
}

export default App;

