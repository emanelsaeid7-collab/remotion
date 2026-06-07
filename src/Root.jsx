import { Composition } from 'remotion';
import { MasterTemplate } from './MasterTemplate'; // تأكد من صحة مسار الملف

const FPS = 30;

export const Root = () => {
  return (
    <Composition
      id="MasterTemplate"
      component={MasterTemplate}
      fps={FPS}
      width={1920}
      height={1080}
      durationInFrames={900} // طول احتياطي في حال غياب البيانات
      
      // هذه الدالة تقوم بحساب طول الفيديو ديناميكياً بناءً على الـ Props الممررة من n8n
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
