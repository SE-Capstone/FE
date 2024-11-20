import { useEffect } from 'react';

import { useParams, useSearchParams } from 'react-router-dom';

import { useGetListPhaseQuery } from '../hooks/queries';
import { ActionTablePhasesWidget } from '../widgets';
import Milestones from '../widgets/milestone.widget';

import { Head, StateHandler } from '@/components/elements';

export function ListPhasePage() {
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const setTab = () => {
    const params = new URLSearchParams();
    params.set('tab', 'phase');
    setSearchParams(params);
  };

  useEffect(() => {
    // Only set the tab if it is not already set
    if (searchParams.get('tab') !== 'phase') {
      setTab();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
