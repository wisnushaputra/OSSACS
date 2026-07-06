import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from './auth';

interface SocketState {
  sockets: Record<string, Socket>;
  connected: Record<string, boolean>;
  connect: (namespace: string) => void;
  disconnect: (namespace: string) => void;
  subscribe: (namespace: string, room: string) => void;
  unsubscribe: (namespace: string, room: string) => void;
}

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useSocketStore = create<SocketState>((set, get) => ({
  sockets: {},
  connected: {},

  connect: (namespace: string) => {
    const { sockets } = get();
    if (sockets[namespace]) return; // Already initialized

    const token = useAuthStore.getState().accessToken;
    if (!token) return;

    const socket = io(`${SOCKET_URL}${namespace}`, {
      auth: { token },
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      set((state) => ({
        connected: { ...state.connected, [namespace]: true },
      }));
    });

    socket.on('disconnect', () => {
      set((state) => ({
        connected: { ...state.connected, [namespace]: false },
      }));
    });

    socket.on('connect_error', (err) => {
      console.error(`Socket connection error for ${namespace}:`, err.message);
    });

    set((state) => ({
      sockets: { ...state.sockets, [namespace]: socket },
    }));
  },

  disconnect: (namespace: string) => {
    const { sockets } = get();
    const socket = sockets[namespace];
    if (socket) {
      socket.disconnect();
      set((state) => {
        const newSockets = { ...state.sockets };
        delete newSockets[namespace];
        return { sockets: newSockets };
      });
    }
  },

  subscribe: (namespace: string, room: string) => {
    const { sockets } = get();
    const socket = sockets[namespace];
    if (socket) {
      socket.emit('subscribe', room);
    }
  },

  unsubscribe: (namespace: string, room: string) => {
    const { sockets } = get();
    const socket = sockets[namespace];
    if (socket) {
      socket.emit('unsubscribe', room);
    }
  },
}));

// Hooks
export const useDashboardSocket = () => {
  return useSocketStore((state) => state.sockets['/dashboard']);
};

export const useWorkflowSocket = () => {
  return useSocketStore((state) => state.sockets['/workflow']);
};

export const useDeviceSocket = () => {
  return useSocketStore((state) => state.sockets['/devices']);
};

export const useNotificationSocket = () => {
  return useSocketStore((state) => state.sockets['/notification']);
};

export const useEventsSocket = () => {
  return useSocketStore((state) => state.sockets['/events']);
};