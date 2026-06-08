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
      defaultProps={{ videoData: {} }}
    />
  );
};

registerRoot(Root);
