const READING_KEY = "neuralstorm_reading_settings";

const DEFAULT_SETTINGS = {
  dyslexiaFont: false,
  letterSpacing: "normal",
  lineSpacing: "normal",
  readingBackground: "normal",
};

export function getReadingSettings() {
  const savedSettings = localStorage.getItem(READING_KEY);

  if (savedSettings) {
    try {
      return {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(savedSettings),
      };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  return { ...DEFAULT_SETTINGS };
}

export function applyReadingSettings(settings) {
  const root = document.documentElement;

  root.setAttribute(
    "data-dyslexia-font",
    String(settings.dyslexiaFont)
  );

  root.setAttribute(
    "data-letter-spacing",
    settings.letterSpacing
  );

  root.setAttribute(
    "data-line-spacing",
    settings.lineSpacing
  );

  root.setAttribute(
    "data-reading-background",
    settings.readingBackground
  );

  localStorage.setItem(
    READING_KEY,
    JSON.stringify(settings)
  );
}
export function applyFontSize(enabled) {
  document.documentElement.classList.toggle("large-text", Boolean(enabled));
  localStorage.setItem("zuno_large_text", String(Boolean(enabled)));
}
export function applyHighContrast(enabled) {
  document.body.classList.toggle("high-contrast", Boolean(enabled));
  document.documentElement.classList.toggle("high-contrast", Boolean(enabled));
  localStorage.setItem("zuno_high_contrast", String(Boolean(enabled)));
}
export function getFontSize() { return localStorage.getItem("zuno_large_text") === "true"; }
export function getHighContrast() { return localStorage.getItem("zuno_high_contrast") === "true"; }
export function initializeAccessibility() {
  applyFontSize(getFontSize());
  applyHighContrast(getHighContrast());
  const visual = localStorage.getItem("zuno_visual_mode") === "true";
  document.documentElement.classList.toggle("visual-accessibility", visual);
  const settings = getReadingSettings();
  applyReadingSettings(settings);
}
