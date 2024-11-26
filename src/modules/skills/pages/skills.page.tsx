import { useEffect, useState } from 'react';

import { Container } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AssignSkillPage } from './assign-skill.page';
import { ListSkillPage } from './list-skill.page';

import { CustomTabs, Head } from '@/components/elements';
import { PermissionEnum } from '@/configs';
import { useAuthentication } from '@/modules/profile/hooks';

export function SkillsPage() {
  const { t } = useTranslation();
  const { permissions } = useAuthentication();
  const [activeTabIndex, setActiveTabIndex] = useState<number>(() =>
    parseInt(localStorage.getItem('activeSkillTabIndex') || '0', 10)
  );

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
  };

  useEffect(() => {
    localStorage.setItem('activeSkillTabIndex', activeTabIndex.toString());
  }, [activeTabIndex]);

  return (
    <>
      <Head title={t('common.skills')} />
      <Container maxW="container.2xl" centerContent>
        <CustomTabs
          tabListProps={{
            bg: 'transparent',
          }}
          isSelected={activeTabIndex}
          tabsData={[
            permissions[PermissionEnum.GET_SKILL] && {
              title: t('common.skills'),
              childrenPanel: <ListSkillPage />,
            },
            permissions[PermissionEnum.GET_SKILL_USER] && {
              title: t('common.assignSkill'),
              childrenPanel: <AssignSkillPage />,
            },
          ].filter(Boolean)}
          onTabChange={handleTabChange}
        />
      </Container>
    </>
  );
}
