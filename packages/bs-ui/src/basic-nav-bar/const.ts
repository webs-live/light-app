import { createContext, useContext } from '@app/hooks';
import { InjectionKey } from 'vue';

export interface NavBarProviderContextProps {
  showShare: boolean;
}

const key: InjectionKey<NavBarProviderContextProps> = Symbol('NavBar');

export function createNavBarProviderContext(context: NavBarProviderContextProps) {
  return createContext<NavBarProviderContextProps>(key, context, { writeable: true });
}

export function useNavBarProviderContext() {
  return useContext<NavBarProviderContextProps>(key);
}
