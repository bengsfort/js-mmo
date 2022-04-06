type StyleSelector = string | keyof HTMLElementTagNameMap;

export interface StyleRule {
  [selector: StyleSelector]: Partial<CSSStyleDeclaration>;
}

/**
 * Allows for easy addition of styles and styleseheets.
 * 
 * @param {StyleRule} declarations Object specifying rules and declarations.
 * @returns {HTMLStyleElement} The style element.
 * @example
 addStyleSheetRules({
     h2 {
         background: 'red',
     },
     '.some-el': {
         width: 300,
         height: 50,
     },
 });
 */
export const addStyleSheetRules = (declarations: StyleRule): HTMLStyleElement => {
  const styleEl = document.createElement("style");
  document.head.appendChild(styleEl);
  const styleSheet = styleEl.sheet;

  for (const selector in declarations) {
    const cssRules = declarations[selector];
    let rules = "\n";
    for (const rule in cssRules) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      rules += rule + ": " + `${cssRules[rule]}` + ";\n";
    }
    styleSheet?.insertRule(`${selector} { ${rules} }`, styleSheet.cssRules.length);
  }

  return styleEl;
};
