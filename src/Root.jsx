import { registerRoot, Composition } from 'remotion';
import { MasterTemplate } from './MasterTemplate';

const FPS = 30;

export const Root = () => {
  return (
    <Composition
      id="FixVideo"
      component={MasterTemplate}
      fps={FPS}
      width={1080}
      height={1920}
      durationInFrames={900}
      calculateMetadata={async ({ props }) => {
        // ✅ props = { videoData: {...} } — يجب الوصول عبر props.videoData
        const data = props?.videoData || {};
        const ctaFrames = data.ctaDurFrames || 150;
        
        if (data.sceneTimings && data.sceneTimings.length > 0) {
          const lastTiming = data.sceneTimings[data.sceneTimings.length - 1];
          const scenesDurationFrames = Math.ceil(lastTiming.end * FPS);
          
          console.log(`[metadata] scenes=${scenesDurationFrames} + cta=${ctaFrames} = ${scenesDurationFrames + ctaFrames}`);
          
          return {
            durationInFrames: scenesDurationFrames + ctaFrames,
          };
        }
        
        return { durationInFrames: 900 };
      }}
    />
  );
};

registerRoot(Root);
