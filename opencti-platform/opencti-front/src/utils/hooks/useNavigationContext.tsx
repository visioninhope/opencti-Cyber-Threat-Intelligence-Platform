import React, { ReactNode, createContext, useMemo, useState, useContext, useEffect } from 'react';

interface CreateRelationshipContextStateType {
  relationshipTypes?: string[]
  stixCoreObjectTypes?: string[]
  connectionKey?: string
  reversed?: boolean
  paginationOptions?: unknown
  onCreate?: () => void
}

export interface CreateRelationshipContextType {
  state: CreateRelationshipContextStateType
  setState: (state: Partial<CreateRelationshipContextStateType>) => void
  resetState: () => void
}

const defaultContext: CreateRelationshipContextType = {
  state: {
    relationshipTypes: [],
    stixCoreObjectTypes: [],
    connectionKey: 'Pagination_stixCoreObjects',
    reversed: false,
    paginationOptions: undefined,
  },
  setState: () => {},
  resetState: () => {},
};

export const CreateRelationshipContext = createContext<CreateRelationshipContextType>(defaultContext);

export const UseNavigationContext = ({ children }: { children: ReactNode }) => {
  const [relationshipTypes, setRelationshipTypes] = useState<string[] | undefined>([]);
  const [stixCoreObjectTypes, setStixCoreObjectTypes] = useState<string[] | undefined>([]);
  const [connectionKey, setConnectionKey] = useState<string | undefined>('Pagination_stixCoreObjects');
  const [reversed, setReversed] = useState<boolean | undefined>(false);
  const [paginationOptions, setPaginationOptions] = useState<unknown>();
  const [onCreate, setOnCreate] = useState<() => void>();

  const state: CreateRelationshipContextStateType = {
    relationshipTypes,
    stixCoreObjectTypes,
    connectionKey,
    reversed,
    paginationOptions,
    onCreate,
  };

  const setState = (newValues: Partial<CreateRelationshipContextStateType>) => {
    const {
      relationshipTypes: updatedRelationshipTypes,
      stixCoreObjectTypes: updatedStixCoreObjectTypes,
      connectionKey: updatedConnectionKey,
      reversed: updatedReversed,
      paginationOptions: updatedPaginationOptions,
      onCreate: updatedOnCreate,
    } = newValues;
    if (Object.keys(newValues).includes('relationshipTypes')) setRelationshipTypes(updatedRelationshipTypes);
    if (Object.keys(newValues).includes('stixCoreObjectTypes')) setStixCoreObjectTypes(updatedStixCoreObjectTypes);
    if (Object.keys(newValues).includes('connectionKey')) setConnectionKey(updatedConnectionKey);
    if (Object.keys(newValues).includes('reversed')) setReversed(updatedReversed);
    if (Object.keys(newValues).includes('paginationOptions')) setPaginationOptions(updatedPaginationOptions);
    if (Object.keys(newValues).includes('onCreate')) setOnCreate(() => updatedOnCreate); // Dispatching inner function to let context consumer call the onCreate function
  };

  const values = useMemo<CreateRelationshipContextType>(() => ({
    state,
    setState,
    resetState: () => setState(defaultContext.state),
  }), [...Object.values(state)]);

  return (
    <CreateRelationshipContext.Provider value={values}>
      {children}
    </CreateRelationshipContext.Provider>
  );
};

const useNavigationContext = (storeState?: Partial<CreateRelationshipContextStateType>) => {
  const { state, setState, resetState } = useContext(CreateRelationshipContext);

  useEffect(() => {
    if (storeState) {
      setState(storeState);
      return resetState;
    }
    return () => {};
  }, [storeState]);

  return state;
};

export default useNavigationContext;
