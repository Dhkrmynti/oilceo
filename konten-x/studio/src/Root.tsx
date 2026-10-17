import { Composition, Folder, Still } from "remotion";
import { MeetingLoop } from "./oil/Gif";
import { PostBoardNow, PostEmbargoed, PostInOffice, PostLatestBarrel } from "./oil/Live";
import { Demo, SceneBarrels, SceneBreaking, SceneEmbargo, SceneEnd, SceneMeeting, ScenePromoted, SceneReserve } from "./oil/Demo";
import { Banner, Logo } from "./oil/Stills";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Profile">
        <Still id="Logo" component={Logo} width={1000} height={1000} />
        <Still id="Banner" component={Banner} width={1500} height={500} />
      </Folder>
      <Folder name="Scenes">
        <Composition id="SceneBreaking" component={SceneBreaking} width={1920} height={1080} fps={30} durationInFrames={120} />
        <Composition id="ScenePromoted" component={ScenePromoted} width={1920} height={1080} fps={30} durationInFrames={150} />
        <Composition id="SceneReserve" component={SceneReserve} width={1920} height={1080} fps={30} durationInFrames={180} />
        <Composition id="SceneMeeting" component={SceneMeeting} width={1920} height={1080} fps={30} durationInFrames={180} />
        <Composition id="SceneBarrels" component={SceneBarrels} width={1920} height={1080} fps={30} durationInFrames={150} />
        <Composition id="SceneEmbargo" component={SceneEmbargo} width={1920} height={1080} fps={30} durationInFrames={90} />
        <Composition id="SceneEnd" component={SceneEnd} width={1920} height={1080} fps={30} durationInFrames={120} />
      </Folder>
      {/* 990 frames of scenes minus six 12-frame fades = 918 */}
      <Composition id="Demo" component={Demo} width={1920} height={1080} fps={30} durationInFrames={918} />
      <Folder name="Live">
        <Still id="PostInOffice" component={PostInOffice} width={1080} height={1350} />
        <Still id="PostEmbargoed" component={PostEmbargoed} width={1080} height={1350} />
        <Still id="PostLatestBarrel" component={PostLatestBarrel} width={1080} height={1350} />
        <Still id="PostBoardNow" component={PostBoardNow} width={1080} height={1350} />
      </Folder>
      <Folder name="Posts">
        <Composition id="MeetingGif" component={MeetingLoop} width={600} height={600} fps={30} durationInFrames={120} />
      </Folder>
    </>
  );
};
