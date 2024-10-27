export type QueryListPhaseInput = {
  projectId: string;
};

export enum PhaseStatus {
  NoPhase = 1,
  NoPhaseRunning = 2,
  Running = 3,
  Complete = 4, // No more phase (last phase)
  Other = 5,
}

export type IPhase = {
  id: string;
  title: string;
  description: string;
  expectedStartDate: Date;
  expectedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  projectId: string;
};

export type IListPhase = {
  phases: IPhase[];
  status: PhaseStatus;
};
