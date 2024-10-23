import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { ROOM_NAME } from 'common/constants';
import { createRoomId, createHost } from '@common/utils';

import { Header, WelcomeContainer } from '../components';

const Home: NextPage = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');

  function createRoom() {
    const roomId = createRoomId();

    createHost(roomId);
    router.push(`/${ROOM_NAME}/${roomId}`);
  }

  function joinRoom() {
    router.push(`/${ROOM_NAME}/${roomId}`);
  }

  return (
    <>
      <Header />

      <WelcomeContainer>
        <button
          onClick={createRoom}
          className="p-3 bg-red-600 hover:bg-red-800 rounded-md text-white text-sm founded-medium"
        >
          Criar sala
        </button>

        <input
          onChange={(e: any) => setRoomId(e.target.value)}
          placeholder="Enter or paste room id"
          className="px-4 py-1 w-80 rounded-md"
        />

        <button
          onClick={joinRoom}
          disabled={roomId.length == 0}
          className="p-3 bg-red-600 hover:bg-red-800 rounded-md text-white text-sm founded-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Entrar
        </button>
      </WelcomeContainer>
    </>
  );
};

export default Home;
