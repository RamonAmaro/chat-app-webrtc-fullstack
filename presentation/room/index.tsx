import { useEffect, useState } from 'react';

import { Chat, ControlPanel, Status } from '@components/index';
import { SharedScreenStream, Streams } from '@components/streams';
import { usePeer, useScreen } from '@hooks/index';
import useMediaStream from '@hooks/use-media-stream';
import { UsersConnectionProvider, UsersSettingsProvider } from 'contexts';
import { useRouter } from 'next/router';
import { MediaConnection } from 'peerjs';
import { toast, ToastContainer } from 'react-toastify';

import { LoaderError, Modal } from '@common/components';
import { FAILURE_MSG, LOADER_PEER_MSG, TOAST_PROPS } from '@common/constants';
import { Kind, PeerId } from '@common/types';
import { useSocketContext } from 'contexts/socket';

export default function App({ stream }: { stream: MediaStream }) {
  const router = useRouter();
  const socket = useSocketContext();

  const { muted, visible, toggle, toggleVideo } = useMediaStream(stream);
  const { peer, myId, isPeerReady } = usePeer(stream);
  const { startShare, stopShare, screenTrack } = useScreen(stream);

  const [modal, setModal] = useState<'hidden' | 'chat' | 'status' | 'close'>(
    'hidden'
  );

  const [fullscreen, setFullscreen] = useState(false);

  function replaceTrack(track: MediaStreamTrack) {
    return (peer: MediaConnection) => {
      const sender = peer.peerConnection
        ?.getSenders()
        .find((s) => s.track?.kind === track.kind);

      sender?.replaceTrack(track);
    };
  }

  useEffect(() => {
    socket?.on('host:muted-user', (peerId: PeerId) => {
      if (myId === peerId) {
        toggleKind('audio');
        toast('you are muted by host');
      } else {
        toast('user muted by host');
      }
    });

    return () => {
      socket?.off('host:muted-user');
    };
  }, [myId]);

  if (!isPeerReady) return <LoaderError msg={LOADER_PEER_MSG} />;
  if (!peer) return <LoaderError msg={FAILURE_MSG} />;

  async function toggleKind(kind: Kind, users?: MediaConnection[]) {
    switch (kind) {
      case 'audio': {
        toggle('audio')(stream);
        socket?.emit('user:toggle-audio', myId);
        return;
      }
      case 'video': {
        toggleVideo((newVideoTrack: MediaStreamTrack) =>
          users!.forEach(replaceTrack(newVideoTrack))
        );
        socket?.emit('user:toggle-video', myId);
        return;
      }
      case 'screen': {
        if (screenTrack) {
          stopShare(screenTrack);
          socket?.emit('user:stop-share-screen');
          setFullscreen(false);
          toast('Stopped presenting screen');
        } else {
          await startShare(
            () => {
              socket?.emit('user:share-screen');
              toast('Starting presenting screen');
            },
            () => socket?.emit('user:stop-share-screen')
          );
        }
        return;
      }
      case 'fullscreen': {
        setFullscreen(!fullscreen);
        return;
      }
      case 'chat': {
        modal == 'chat' ? setModal('close') : setModal('chat');
        return;
      }
      case 'users': {
        modal == 'status' ? setModal('close') : setModal('status');
        return;
      }
      default:
        break;
    }
  }

  return (
    <div className="flex w-full h-full">
      <UsersSettingsProvider>
        <div className="sm:flex flex-col flex p-4 w-full h-screen">
          <UsersConnectionProvider stream={stream} myId={myId} peer={peer}>
            <div className="flex flex-1 place-items-center place-content-center gap-4">
              <SharedScreenStream
                sharedScreen={screenTrack}
                fullscreen={fullscreen}
              />

              <Streams
                stream={stream}
                muted={muted}
                visible={visible}
                sharedScreen={screenTrack}
                fullscreen={fullscreen}
              />
            </div>

            <div className="flex items-center">
              <ControlPanel
                visible={visible}
                muted={muted}
                screenTrack={Boolean(screenTrack)}
                chat={modal == 'chat'}
                onToggle={toggleKind}
                onLeave={() => router.push('/')}
              />
            </div>
          </UsersConnectionProvider>
        </div>

        <Modal
          title={
            modal === 'chat'
              ? 'Meeting Chat'
              : modal === 'status'
              ? 'People'
              : ''
          }
          modal={modal}
          onClose={() => setModal('close')}
        >
          <div className={modal !== 'chat' ? 'hidden' : ''}>
            <Chat />
          </div>
          <div className={modal !== 'status' ? 'hidden' : ''}>
            <Status muted={muted} visible={visible} />
          </div>
        </Modal>
      </UsersSettingsProvider>
      <ToastContainer {...TOAST_PROPS} />
    </div>
  );
}
