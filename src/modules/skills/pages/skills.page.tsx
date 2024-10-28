import { Container } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AssignSkillPage } from './assign-skill.page';
import { ListSkillPage } from './list-skill.page';

import { CustomTabs, Head } from '@/components/elements';

export function SkillsPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head title={t('common.skills')} />
      <Container maxW="container.2xl" centerContent overflowX="auto">
        <CustomTabs
          tabListProps={{
            bg: 'transparent',
          }}
          tabsData={[
            {
              title: t('common.skills'),
              childrenPanel: <ListSkillPage />,
            },
            {
              title: t('common.assignSkill'),
              childrenPanel: <AssignSkillPage />,
            },
          ]}
        />
      </Container>
    </>
  );
}
