import "./fonts";
import { Composition } from "remotion";
import { EpisodeComp } from "./Episode";
import { EPISODES, FPS, HEIGHT, WIDTH, timing } from "./timeline";

// One composition per episode, RamayanaEpNN (Hindi only); tools/render.sh NN renders it.
export const RemotionRoot: React.FC = () => (
  <>
    {Object.values(EPISODES).map((e) => (
      <Composition key={e.id} id={`RamayanaEp${e.id.slice(2)}`} component={EpisodeComp} defaultProps={{ id: e.id }} durationInFrames={timing(e).total} fps={FPS} width={WIDTH} height={HEIGHT} />
    ))}
  </>
);
