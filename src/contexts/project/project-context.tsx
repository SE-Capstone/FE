import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { isEqual } from 'lodash-es';

import type { ProjectMember } from '@/modules/projects/list-project/types';

export interface IProjectState {
  members: ProjectMember[];
  projectId: string | null;
}

const initialState: IProjectState = {
  members: [],
  projectId: null,
};

export interface IProjectContext {
  members: ProjectMember[];
  projectId: string | null;
  setProjectContext: (state: IProjectState) => void;
  resetProjectContext: () => void;
}

const ProjectContext = createContext<IProjectContext | undefined>(undefined);

export function ProjectProvider({ children }) {
  const [projectState, setProjectState] = useState<IProjectState>(initialState);

  useEffect(() => {
    setProjectState({
      members: [],
      projectId: null,
    });
  }, []);

  const setProjectContext = (state: IProjectState) => {
    setProjectState((prevState) => {
      if (prevState.projectId !== state.projectId || !isEqual(prevState.members, state.members)) {
        return {
          members: state.members,
          projectId: state.projectId,
        };
      }

      return prevState;
    });
  };

  const resetProjectContext = () => {
    setProjectState({
      members: [],
      projectId: null,
    });
  };

  const contextValue = useMemo(
    () => ({ ...projectState, setProjectContext, resetProjectContext }),
    [projectState]
  );

  return <ProjectContext.Provider value={contextValue}> {children} </ProjectContext.Provider>;
}

export { ProjectContext };

export const useProjectContext = () => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error('Project context must be used within an ProjectProvider');
  }

  return context;
};
