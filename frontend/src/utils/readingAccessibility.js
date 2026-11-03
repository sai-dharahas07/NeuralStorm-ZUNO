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