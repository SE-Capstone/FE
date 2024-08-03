import type React from 'react';
import { useRef, createContext, useContext, useCallback, useSyncExternalStore } from 'react';

export function createStoreContext<Store>(initialState: Store) {
  function useStoreData(): {
    get: () => Store;
    set: (value: Partial<Store>) => void;
    subscribe: (callback: () => void) => () => void;
  } {
    const store = useRef<Store>(initialState);

    const get = useCallback(() => store.current, []);

    const subscribers = useRef(new Set<() => void>());

    const set = useCallback((value: Partial<Store>) => {
      store.current = { ...store.current, ...value };
      subscribers.current.forEach((callback) => callback());
    }, []);

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback);

      return () => subscribers.current.delete(callback);
    }, []);

    return {
      get,
      set,
      subscribe,
    };
  }

  type UseStoreDataReturnType = ReturnType<typeof useStoreData>;

  const StoreContext = createContext<UseStoreDataReturnType | null>(null);

  function Provider({ children }: { children: React.ReactNode }) {
    return <StoreContext.Provider value={useStoreData()}>{children}</StoreContext.Provider>;
  }

  type UseStoreReturnValue<SelectorOutput> = [
    SelectorOutput,
    (value: Partial<Store>) => void,
    () => void
  ];

  function useStore<SelectorOutput>(
    selector: (store: Store) => SelectorOutput
  ): UseStoreReturnValue<SelectorOutput> {
    const store = useContext(StoreContext);

    if (!store) {
      throw new Error('Store not found');
    }

    const state = useSyncExternalStore(
      store.subscribe,
      () => selector(store.get()),
      () => selector(initialState)
    );

    const setState = store.set;

    const resetState = useCallback(() => store.set(initialState), [store]);

    return [state, setState, resetState];
  }

  return {
    Provider,
    useStore,
  };
}
