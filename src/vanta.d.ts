declare module 'vanta/dist/vanta.globe.min' {
    interface VantaGlobeOptions {
      el: HTMLElement | string;
      THREE?: any;
      mouseControls?: boolean;
      touchControls?: boolean;
      gyroControls?: boolean;
      minHeight?: number;
      minWidth?: number;
      scale?: number;
      scaleMobile?: number;
      color1?: string;
      color2?: string;
      backgroundColor?: string;
      size?: number;
      points?: number;
      maxDistance?: number;
      spacing?: number;
      showDots?: boolean;
    }
  
    interface VantaEffect {
      destroy: () => void;
    }
  
    function GLOBE(options: VantaGlobeOptions): VantaEffect;
    
    export default GLOBE;
  }