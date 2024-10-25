import { ToastContainerProps } from 'react-toastify';

export const ROOM_NAME = 'room';
export const WINDOW_SIZE_IN_SAMPLES = 1024;
export const MYSELF = 'You';
export const TOAST_PROPS: ToastContainerProps = {
  position: 'bottom-left',
  theme: 'dark',
  autoClose: 3000,
};
export const FAILURE_MSG =
  'Opa!!! Não foi possível criar o stream para você. Tente novamente mais tarde 🫠';
export const LOADER_STREAM_MSG =
  'Carregando... Preparando sua transmissão de vídeo... 🚀';
export const LOADER_PEER_MSG = 'Preparando... 🎮';
