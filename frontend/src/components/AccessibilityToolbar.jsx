import { useState, useEffect } from "react";

import {
  applyFontSize,
  applyHighContrast,
  getFontSize,
  getHighContrast,
} from "../utils/accessibility";

import "./AccessibilityToolbar.css";

export default function AccessibilityToolbar() {
  const [fontSize, setFontSize] = useState(getFontSize);
  const [highContrast, setHighContrast] = useState(getHighContrast);
  const [isOpen, setIsOpen] = useState(false);

  const fontSizes = ["normal", "large", "extra-large"];

  useEffect(() => {
    applyFontSize(fontSize);
  }, [fontSize]);

  useEffect(() => {
    applyHighContrast(highContrast);
  }, [highContrast]);

  const increaseFont = () => {
    const currentIndex = fontSizes.indexOf(fontSize);

    if (currentIndex < fontSizes.length - 1) {
      setFontSize(fontSizes[currentIndex + 1]);
    }
  };

  const decreaseFont = () => {
    const currentIndex = fontSizes.indexOf(fontSize);

    if (currentIndex > 0) {
      setFontSize(fontSizes[currentIndex - 1]);
    }
  };

  const resetSettings = () => {
    setFontSize("normal");
    setHighContrast(false);
  };

  return (
    <div className="accessibility-toolbar">
      <button
        className="accessibility-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Accessibility settings"
      >
        ♿ Accessibility
      </button>

      {isOpen && (
        <div className="accessibility-panel">
          <h2>Accessibility Settings</h2>

          <div className="accessibility-control">
            <span>Text Size</span>

            <div className="accessibility-buttons">
              <button onClick={decreaseFont} aria-label="Decrease text size">
                A−
              </button>

              <button onClick={increaseFont} aria-label="Increase text size">
                A+
              </button>
            </div>

            <p>
              Current:{" "}
              {fontSize === "normal"
                ? "Normal"
                : fontSize === "large"
                ? "Large"
                : "Extra Large"}
            </p>
          </div>

          <div className="accessibility-control">
            <label htmlFor="high-contrast-toggle">
              High Contrast Mode
            </label>

            <input
              id="high-contrast-toggle"
              type="checkbox"
              checked={highContrast}
              onChange={(event) => setHighContrast(event.target.checked)}
            />
          </div>

          <button
            className="accessibility-reset"
            onClick={resetSettings}
          >
            Reset Settings
          </button>

          <button
            className="accessibility-close"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}