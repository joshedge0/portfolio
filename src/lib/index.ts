// ============================================
// PIXELATION ENGINE
// Canvas-based pixelation with desaturation support
// ============================================

export interface RenderBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class PixelationEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private sourceImage: HTMLImageElement;
  private isReady: boolean = false;
  private initialHeight: number = 0;

  constructor(canvas: HTMLCanvasElement, sourceImage: HTMLImageElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true });
    this.sourceImage = sourceImage;
  }

  /**
   * Initialize the canvas dimensions
   */
  init(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.initialHeight = window.innerHeight;
    this.isReady = true;
  }

  /**
   * Render the image with pixelation and saturation effects
   * @param pixelSize - Size of pixel blocks (1 = no pixelation, higher = more pixelated)
   * @param saturation - Color saturation (0-100, where 100 is full color)
   * @param bounds - Optional bounds for positioning {x, y, width, height}
   */
  render(pixelSize: number, saturation: number, bounds?: RenderBounds): void {
    if (!this.isReady || !this.ctx) return;

    const { canvas, ctx, sourceImage, initialHeight } = this;
    const targetBounds: RenderBounds = bounds || {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    };

    // Clear entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate how much of the source image to use
    // As the target height shrinks, we take a proportionally smaller slice from the top of the image
    const sourceHeight = sourceImage.naturalHeight;
    const sourceWidth = sourceImage.naturalWidth;
    
    // Calculate the portion of the source image to display
    // This creates a "reveal from top" effect as it shrinks
    const heightRatio = targetBounds.height / initialHeight;
    const sourceSliceHeight = sourceHeight * heightRatio;

    // Calculate scaled dimensions for pixelation effect
    const scaleFactor = Math.max(1, Math.round(pixelSize));
    const scaledWidth = Math.ceil(targetBounds.width / scaleFactor);
    const scaledHeight = Math.ceil(targetBounds.height / scaleFactor);

    // Create offscreen canvas for pixel manipulation
    const offscreen = document.createElement('canvas');
    offscreen.width = scaledWidth;
    offscreen.height = scaledHeight;
    const offCtx = offscreen.getContext('2d');

    if (!offCtx) return;

    offCtx.imageSmoothingEnabled = true;

    // Draw only the top portion of the source image, scaled down for pixelation
    offCtx.drawImage(
      sourceImage,
      0,                    // source x
      0,                    // source y (start from top)
      sourceWidth,          // source width (full width)
      sourceSliceHeight,    // source height (proportional slice)
      0,                    // dest x
      0,                    // dest y
      scaledWidth,          // dest width
      scaledHeight          // dest height
    );

    // Apply desaturation if needed
    if (saturation < 100) {
      const imageData = offCtx.getImageData(0, 0, scaledWidth, scaledHeight);
      const data = imageData.data;
      const satFactor = saturation / 100;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Calculate luminance using standard weights
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;

        // Interpolate between grayscale and original color
        data[i] = lum + satFactor * (r - lum);
        data[i + 1] = lum + satFactor * (g - lum);
        data[i + 2] = lum + satFactor * (b - lum);
      }

      offCtx.putImageData(imageData, 0, 0);
    }

    // Disable smoothing for crisp pixel effect when scaling up
    ctx.imageSmoothingEnabled = false;

    // Draw scaled-up result (creates pixelated effect)
    ctx.drawImage(
      offscreen,
      0,
      0,
      scaledWidth,
      scaledHeight,
      targetBounds.x,
      targetBounds.y,
      targetBounds.width,
      targetBounds.height
    );
  }

  /**
   * Handle window resize
   */
  resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * Check if the engine is ready
   */
  get ready(): boolean {
    return this.isReady;
  }
}

// ============================================
// ANIMATION UTILITIES
// ============================================

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Map a value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}