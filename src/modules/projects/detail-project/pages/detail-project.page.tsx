import { Container } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useGetDetailProject } from '../apis/detail-project.api';
import { BaseInformationProjectWidget } from '../widgets';

import { Head, StateHandler } from '@/components/elements';
import { LayoutBack } from '@/components/layouts';

export function DetailProjectPage() {
  const { projectId } = useParams();
  const { project, isLoading, isError } = useGetDetailProject({ projectId: projectId || '' });

  return (
    <>
      <Head title={project?.name} />
      <Container maxW="container.2xl" centerContent>
        <StateHandler showLoader={isLoading} showError={!!isError}>
          <LayoutBack>
            <BaseInformationProjectWidget project={project} />
          </LayoutBack>
        </StateHandler>
      </Container>
    </>
  );
}
