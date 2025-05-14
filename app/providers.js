'use client'; // 👈 Must be client to use Redux
import { Provider } from 'react-redux';
import Store from './lib/store';

export function Providers({ children }) {
  return <Provider store={Store}>{children}</Provider>;
}