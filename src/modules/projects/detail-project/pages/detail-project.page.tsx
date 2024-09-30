import { Button, Container } from '@chakra-ui/react';
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
          <LayoutBack
            display="flex"
            flexDir="row"
            justify="space-between"
            alignItems="center"
            mb={5}
          >
            <Button>Edit</Button>
          </LayoutBack>
          <BaseInformationProjectWidget project={project} />
        </StateHandler>
      </Container>
    </>
  );
}
