import { useLanguage } from "../i18n";
import { KEYS, LANGUAGES } from "../data/contract";
const names = { en: "English", te: "తెలుగు", hi: "हिन्दी" };
export default function LanguageSwitcher() {
  const lang = useLanguage();
  const changeLanguage = (event) => {
    const next = event.target.value;
    localStorage.setItem(KEYS.language, next);
    document.documentElement.lang = next === "te" ? "te-IN" : next === "hi" ? "hi-IN" : "en";
    window.dispatchEvent(new Event("zuno-language-change"));
  };
  return <label className="global-control language-switch"><span>Language</span><select aria-label="Choose interface language" value={lang} onChange={changeLanguage}>{LANGUAGES.map(code => <option value={code} key={code}>{names[code]}</option>)}</select></label>;
}
