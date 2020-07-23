export interface Language {
  name: string;
  colorPicker: {
    aria: {
      trigger: string;
      switch: string;
      close: string;
    };
    red: string;
    green: string;
    blue: string;
    alpha: string;
    hue: string;
    saturation: string;
    lightness: string;
  };
}
