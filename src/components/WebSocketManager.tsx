import { useEffect } from 'react';
import { wsClient } from '../store';

export function WebSocketManager() {
  useEffect(() => {
    wsClient.connect();
  }, []);

  return null; 
}