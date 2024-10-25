'use client';

import { createContext, ReactNode, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

export const SocketContext = createContext<Socket | null>(null);

type SocketStore = {
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
};

const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  setSocket: (socket: Socket) => set({ socket }),
}));

export default function SocketProvider({ children }: { children: ReactNode }) {
  const { socket, setSocket } = useSocketStore();

  useEffect(() => {
    if (!socket?.active) {
      const socket = io('http://localhost:8080');
      console.log(socket);
      setSocket(socket);
    }
    return () => {
      socket?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export const useSocketContext = () => useContext(SocketContext);
