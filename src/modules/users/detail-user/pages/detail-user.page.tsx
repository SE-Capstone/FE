import { Container } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useGetDetailUser } from '../apis/detail-user.api';
import { BaseInformationUserWidget } from '../widgets';
import { AdminChangePasswordWidget } from '../widgets/admin-change-password.widget';

import { Head, StateHandler } from '@/components/elements';
import { LayoutBack } from '@/components/layouts';
import { PermissionEnum } from '@/configs';
import { useAuthentication } from '@/modules/profile/hooks';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function DetailUserPage() {
  const { userId } = useParams();
  const { permissions } = useAuthentication();
  const { user, isLoading, isError } = useGetDetailUser({ userId: userId || '' });

  return (
    <>
      <Head title={user?.fullName} />
      <Container maxW="container.2xl" centerContent>
        <StateHandler showLoader={isLoading} showError={!!isError}>
          <LayoutBack path={APP_PATHS.listUser}>
            <BaseInformationUserWidget user={user} />
          </LayoutBack>
          {permissions[PermissionEnum.CHANGE_PASSWORD_USER] && (
            <AdminChangePasswordWidget user={user} />
          )}
        </StateHandler>
      </Container>
    </>
  );
}
