declare module 'tinycolor2' {
  interface ColorFormats {
    hex: string
    hex8: string
    hsl: { h: number; s: number; l: number }
    hsv: { h: number; s: number; v: number }
    name: string
    rgb: { r: number; g: number; b: number }
    prgb: { r: string; g: string; b: string; a: string }
  }

  interface Instance {
    clone(): Instance
    lighten(amount?: number): Instance
    darken(amount?: number): Instance
    toHexString(): string
    toRgbString(): string
    toHsl(): { h: number; s: number; l: number }
  }

  interface Constructor {
    (color: string): Instance
    (color: { h: number; s: number; l: number }): Instance
    (r: number, g: number, b: number): Instance
  }

  const tinycolor: Constructor

  export default tinycolor
}
