import type { User } from '@/lib/user';
import { createContext, useContext } from 'react';

export const UserContext = createContext<{ user: User | null, revalidateUser: () => void }>({ user: null, revalidateUser: () => {} });

export const useUser = () => {
  return useContext(UserContext);
}