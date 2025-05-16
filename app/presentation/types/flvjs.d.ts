declare module "flv.js" {
  namespace flvjs {
    interface FlvJsConfig {
      type: "flv";
      url: string;
      isLive?: boolean;
      hasAudio?: boolean;
      hasVideo?: boolean;
      [key: string]: any;
    }

    interface Player {
      attachMediaElement: (element: HTMLVideoElement) => void;
      load: () => void;
      play: () => Promise<void>;
      pause: () => void;
      destroy: () => void;
      on: (event: string, callback: (...args: any[]) => void) => void;
    }

    interface FlvJs {
      isSupported: () => boolean;
      createPlayer: (config: FlvJsConfig) => Player;
      Events: Record<string, string>;
      ErrorTypes: Record<string, string>;
      ErrorDetails: Record<string, string>;
    }
  }

  const flvjs: flvjs.FlvJs;
  export default flvjs;
  export = flvjs; // Hỗ trợ cả CommonJS
}
