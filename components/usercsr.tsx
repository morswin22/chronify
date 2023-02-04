import { User } from '@/lib/db';
import { createContext, useContext } from 'react';

export const UserContext = createContext<User | null>(null);

export const useUser = () => {
  return useContext(UserContext);
}