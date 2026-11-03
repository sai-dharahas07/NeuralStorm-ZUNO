
import { useEffect, useState } from "react";
import "./AccessibilityControls.css";

export default function AccessibilityControls() {
  const [largeText, setLargeText] = useState(
    localStorage.getItem("zuno_large_text") === "true"
  );

  const [highContrast, setHighContrast] = useState(
    localStorage.getItem("zuno_high_contrast") === "true"
  );

  const [visualMode, setVisualMode] = useState(
    localStorage.getItem("zuno_visual_mode") === "true"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("large-text", largeText);
    document.body.classList.toggle("high-contrast", highContrast);
    document.documentElement.classList.toggle("high-contrast", highContrast);
    document.documentElement.classList.toggle("visual-accessibility", visualMode);

    localStorage.setItem("zuno_large_text", largeText);
    localStorage.setItem("zuno_high_contrast", highContrast);
    localStorage.setItem("zuno_visual_mode", visualMode);
  }, [largeText, highContrast, visualMode]);

  return (
    <section
      className="accessibility-panel"
      aria-labelledby="accessibility-title"
    >
      <h2 id="accessibility-title">♿ Accessibility Settings</h2>

      <label className="accessibility-option">
        <input
          type="checkbox"
          checked={visualMode}
          onChange={(e) => setVisualMode(e.target.checked)}
        />
        Enable Visual Accessibility Mode
      </label>

      <label className="accessibility-option">
        <input
          type="checkbox"
          checked={largeText}
          onChange={(e) => setLargeText(e.target.checked)}
        />
        Increase Text Size
      </label>

      <label className="accessibility-option">
        <input
          type="checkbox"
          checked={highContrast}
          onChange={(e) => setHighContrast(e.target.checked)}
        />
        Enable High Contrast
      </label>

      <p className="accessibility-description">
        These settings apply throughout ZUNO and remain saved on this device.
      </p>
    </section>
  );
}

