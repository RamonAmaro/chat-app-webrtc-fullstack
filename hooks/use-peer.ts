import { useEffect, useState } from 'react';

import { useMediaStream } from '@hooks/index';
import { useRouter } from 'next/router';

import { Nullable, PeerId, RoomId } from '@common/types';
import { error } from '@common/utils';
import { useSocketContext } from 'contexts/socket';
import Peer from 'peerjs';

/**
 * Creates a peer and joins them into the room
 * @returns peer object, its id and meta-state whether is peer fully created
 */
const usePeer = (stream: MediaStream) => {
  const socket = useSocketContext();
  const room = useRouter().query.roomId as RoomId;
  const user = { name: 'Ramon', id: Math.random(), picture: '' };

  const { muted, visible } = useMediaStream(stream);

  const [isLoading, setIsLoading] = useState(true);
  const [peer, setPeer] = useState<Nullable<Peer>>(null);
  const [myId, setMyId] = useState<PeerId>('');

  useEffect(() => {
    (async function createPeerAndJoinRoom() {
      try {
        const peer = new Peer();
        setPeer(peer);
        setIsLoading(false);

        peer.on('open', (id) => {
          console.log('your device id: ', { id, socket });
          setMyId(id);
          socket?.emit('room:join', {
            room,
            user: {
              id,
              muted,
              visible,
              name: user.name,
              picture: user.picture,
            },
          });
        });

        peer.on('error', error('Failed to setup peer connection'));
      } catch (e) {
        error('Unable to create peer')(e);
      }
    })();
  }, []);

  return {
    peer,
    myId,
    isPeerReady: !isLoading,
  };
};

export default usePeer;
