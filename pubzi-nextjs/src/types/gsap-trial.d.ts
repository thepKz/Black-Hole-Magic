declare module 'gsap-trial/SplitText' {
  export class SplitText {
    constructor(target: string | Element | Element[], options?: {
      type?: string;
      linesClass?: string;
      wordsClass?: string;
      charsClass?: string;
    });
    chars?: Element[];
    words?: Element[];
    lines?: Element[];
    elements: Element[];
    revert(): void;
  }
}
