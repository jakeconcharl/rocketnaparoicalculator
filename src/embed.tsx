import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./styles.css";

declare global {
  interface Window {
    NapaCalculator?: {
      mount: (target: string | HTMLElement, overrides?: Partial<EmbedConfig>) => void;
    };
  }
}

export type EmbedConfig = {
  title: string;
  subtitle: string;
};

const defaultConfig: EmbedConfig = {
  title: "NAPA ROI Calculator",
  subtitle: "Estimate recovered revenue, labor savings, and net ROI."
};

function resolveTarget(target: string | HTMLElement) {
  if (typeof target === "string") {
    const element = document.querySelector<HTMLElement>(target);
    if (!element) {
      throw new Error(`Unable to find mount target: ${target}`);
    }
    return element;
  }

  return target;
}

window.NapaCalculator = {
  mount(target, overrides = {}) {
    const container = resolveTarget(target);
    const root = ReactDOM.createRoot(container);

    root.render(
      <React.StrictMode>
        <App mode="embed" config={{ ...defaultConfig, ...overrides }} />
      </React.StrictMode>
    );
  }
};
