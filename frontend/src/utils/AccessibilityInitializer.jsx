import { useEffect } from "react";
import { initializeAccessibility } from "./accessibility";

export default function AccessibilityInitializer() {
  useEffect(() => {
    initializeAccessibility();
  }, []);

  return null;
}