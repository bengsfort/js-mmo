import { Node2d } from "@js-mmo/engine";

import { addStyleSheetRules, StyleRule } from "./debug_add_styles";

const sceneTreeStyles: StyleRule = {
  ".scene_tree": {
    position: "absolute",
    top: "0",
    right: "0",
    height: "100%",
    width: "250px",
    background: "rgba(255, 255, 255, 0.55)",
    color: "#383838",
  },
};

let stylesheet: HTMLStyleElement | null = null;

export const createSceneTree = (scene: Node2d) => {
  stylesheet = addStyleSheetRules(sceneTreeStyles);
};

export const removeSceneTree = () => {
  // Remove stylesheet
  stylesheet?.remove();
  stylesheet = null;
};
