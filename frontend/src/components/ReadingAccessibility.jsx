import { useState, useEffect } from "react";

import {
  getReadingSettings,
  applyReadingSettings,
} from "../utils/readingAccessibility";

import "./ReadingAccessibility.css";

export default function ReadingAccessibility() {
  const [settings, setSettings] = useState(getReadingSettings);

  useEffect(() => {
    applyReadingSettings(settings);
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    setSettings({
      dyslexiaFont: false,
      letterSpacing: "normal",
      lineSpacing: "normal",
      readingBackground: "normal",
    });
  };

  return (
    <section className="reading-accessibility-panel">
      <h2>📖 Reading Accessibility</h2>

      <div className="reading-setting">
        <label htmlFor="dyslexia-font">
          Dyslexia-Friendly Font
        </label>

        <input
          id="dyslexia-font"
          type="checkbox"
          checked={settings.dyslexiaFont}
          onChange={(event) =>
            updateSetting("dyslexiaFont", event.target.checked)
          }
        />
      </div>

      <div className="reading-setting">
        <label htmlFor="letter-spacing">
          Letter Spacing
        </label>

        <select
          id="letter-spacing"
          value={settings.letterSpacing}
          onChange={(event) =>
            updateSetting("letterSpacing", event.target.value)
          }
        >
          <option value="normal">Normal</option>
          <option value="wide">Wide</option>
          <option value="extra-wide">Extra Wide</option>
        </select>
      </div>

      <div className="reading-setting">
        <label htmlFor="line-spacing">
          Line Spacing
        </label>

        <select
          id="line-spacing"
          value={settings.lineSpacing}
          onChange={(event) =>
            updateSetting("lineSpacing", event.target.value)
          }
        >
          <option value="normal">Normal</option>
          <option value="comfortable">Comfortable</option>
          <option value="relaxed">Relaxed</option>
        </select>
      </div>

      <div className="reading-setting">
        <label htmlFor="reading-background">
          Reading Background
        </label>

        <select
          id="reading-background"
          value={settings.readingBackground}
          onChange={(event) =>
            updateSetting("readingBackground", event.target.value)
          }
        >
          <option value="normal">White</option>
          <option value="cream">Cream</option>
          <option value="soft-blue">Soft Blue</option>
        </select>
      </div>

      <button
        className="reading-reset"
        onClick={resetSettings}
      >
        Reset Reading Settings
      </button>
    </section>
  );
}