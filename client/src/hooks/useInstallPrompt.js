import { useEffect } from "react";
import { openInstallPrompt } from "../utils/util.js";

export function useInstallPrompt() {
  useEffect(() => {
    return openInstallPrompt();
  }, []);
}
