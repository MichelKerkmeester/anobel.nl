interface Webflow extends Array<any> {
  push: (callback: () => void) => void;
  destroy: () => void;
  ready: () => void;
}

declare global {
  interface Window {
    Webflow: Webflow;
    Swiper: any;
  }
}

export {};
