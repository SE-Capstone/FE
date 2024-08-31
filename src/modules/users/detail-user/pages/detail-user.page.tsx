import { Container } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useGetDetailUser } from '../apis/detail-user.api';
import { BaseInformationUserWidget } from '../widgets';
import { AdminChangePasswordWidget } from '../widgets/admin-change-password.widget';

import { Head, StateHandler } from '@/components/elements';
import { LayoutBack } from '@/components/layouts';

export function DetailUserPage() {
  const { userId } = useParams();
  const { user, isLoading, isError } = useGetDetailUser({ userId: userId || '' });

  return (
    <>
      <Head title={user?.fullName} />
      <Container maxW="container.2xl" centerContent>
        <StateHandler showLoader={isLoading} showError={!!isError}>
          <LayoutBack>
            <BaseInformationUserWidget user={user} />
          </LayoutBack>
          <AdminChangePasswordWidget user={user} />
        </StateHandler>
      </Container>
    </>
  );
}
