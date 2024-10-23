import { VideoCameraIcon, MicrophoneIcon } from '@heroicons/react/solid';
import Tooltip from 'react-tooltip';

import { useMediaStream } from '@hooks/index';
import { MYSELF } from '@common/constants';
import { CrossLineDiv } from '@common/components';

import { PeerVideo, VideoContainer } from '..';

export default function Lobby({
  stream,
  onJoinRoom,
}: {
  stream: MediaStream;
  onJoinRoom: () => void;
}) {
  const { muted, visible, toggle, toggleVideo } = useMediaStream(stream);

  return (
    <div className="h-screen w-auto grid grid-cols-2 gap-4 place-content-center place-items-center">
      <div className="flex flex-col gap-2">
        <VideoContainer
          id="me"
          muted={muted}
          visible={visible}
          stream={stream}
          userPicture={''}
        >
          <PeerVideo key="me" stream={stream} name={MYSELF} isMe={true} />
        </VideoContainer>

        <div className="flex justify-end gap-2">
          <button
            onClick={toggleVideo}
            data-for="visibility"
            data-tip={`${!visible ? 'switch on' : 'switch off'}`}
            className="p-3 rounded-xl text-white bg-slate-800 hover:bg-indigo-700 relative"
          >
            <VideoCameraIcon className="h-6 w-6" />
            {!visible && <CrossLineDiv />}
          </button>
          <Tooltip id="visibility" effect="solid" />

          <button
            onClick={() => toggle('audio')(stream)}
            data-for="audio"
            data-tip={`${muted ? 'unmute' : 'mute'}`}
            className="p-3 rounded-xl text-white bg-slate-800 hover:bg-indigo-700 relative"
          >
            <MicrophoneIcon className="h-6 w-6" />
            {muted && <CrossLineDiv />}
          </button>
          <Tooltip id="audio" effect="solid" />
        </div>
      </div>

      <button
        onClick={onJoinRoom}
        type="button"
        className="p-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-800"
      >
        Entrar na sala
      </button>
    </div>
  );
}
