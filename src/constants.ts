export interface Sizes {
  WIDTH: number;
  HEIGHT: number;
  ASPECT_RATIO: number;
}

export const SIZES: Sizes = {
  WIDTH: window.innerWidth,
  HEIGHT: window.innerHeight,
  ASPECT_RATIO: window.innerWidth / window.innerHeight,
};
