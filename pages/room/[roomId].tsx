'use client';

import { Lobby } from '@components/index';
import { useMediaStream } from '@hooks/index';
import { NextPage } from 'next';
import Room from 'presentation/room/index';
import { useState } from 'react';

import { LoaderError } from '@common/components';
import { FAILURE_MSG, LOADER_STREAM_MSG } from '@common/constants';

const RoomPage: NextPage = () => {
  const [isLobby, setIsLobby] = useState(true);
  const { stream, isLoading } = useMediaStream();

  if (isLoading) return <LoaderError msg={LOADER_STREAM_MSG} />;
  if (!stream) return <LoaderError msg={FAILURE_MSG} />;

  if (isLobby)
    return <Lobby stream={stream} onJoinRoom={() => setIsLobby(false)} />;

  return <Room stream={stream} />;
};

export default RoomPage;
