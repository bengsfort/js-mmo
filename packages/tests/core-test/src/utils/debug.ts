let boundsVisible = false;

declare global {
  interface Window {
    __debug: {
      showBounds(value: boolean): void;
    };
  }
}

export const showBounds = (value: boolean) => (boundsVisible = value);
export const getShowBounds = () => boundsVisible;

window.__debug = {
  showBounds,
};
