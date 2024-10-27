import { useParams } from 'react-router-dom';

import { useGetListPhaseQuery } from '../hooks/queries';
import { ActionTablePhasesWidget } from '../widgets';
import Milestones from '../widgets/milestone.widget';

import { Head, StateHandler } from '@/components/elements';

export function ListPhasePage() {
  const { projectId } = useParams();
  const { listPhase, phaseStatus, isError, isLoading, isRefetching } = useGetListPhaseQuery({
    params: {
      projectId: projectId || '',
    },
  });

  return (
    <>
      <Head title="Phase" />
      <StateHandler showLoader={isLoading} showError={!!isError}>
        <ActionTablePhasesWidget phaseStatus={phaseStatus} />
        <Milestones phases={listPhase} isLoading={isLoading || isRefetching} />
      </StateHandler>
    </>
  );
}
