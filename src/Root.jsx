import { registerRoot, Composition } from 'remotion';
import { MasterTemplate } from './MasterTemplate'; // تأكد أن المسار صحيح لملف MasterTemplate

const FPS = 30;

export const Root = () => {
  return (
    <Composition
      id="FixVideo" // يجب أن يطابق الاسم المكتوب في أمر الرندر على السيرفر تماماً
      component={MasterTemplate}
      fps={FPS}
      width={1080}
      height={1920}
      durationInFrames={900}
      calculateMetadata={async ({ props }) => {
        const ctaFrames = props.ctaDurFrames || 150;
        const visualOffset = props.visualOffset !== undefined ? props.visualOffset : 0.4;
        
        if (props.sceneTimings && props.sceneTimings.length > 0) {
          const lastTiming = props.sceneTimings[props.sceneTimings.length - 1];
          const scenesDurationSec = lastTiming.end + visualOffset;
          const scenesDurationFrames = Math.round(scenesDurationSec * FPS);
          return {
            durationInFrames: scenesDurationFrames + ctaFrames,
          };
        }
        
        return {
          durationInFrames: 900,
        };
      }}
    />
  );
};

// ⚠️ هذا هو السطر الحرج الذي تم حذفه سابقاً وتسبب في الانهيار، قمنا بإعادته الآن:
registerRoot(Root);
