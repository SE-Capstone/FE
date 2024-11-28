import { GridItem, SimpleGrid } from '@chakra-ui/react';
import Chart from 'chart.js/auto';

import StatsWithIcons from '../widgets/card-stat.widget';
import { ReportProjectsByStatusWidget } from '../widgets/report-project-by-status.widget';
import { ReportSkillsWidget } from '../widgets/report-skills.widget';

Chart.register();

export function DashboardPage() {
  return (
    <>
      <StatsWithIcons />
      {/* <Grid
        alignItems="center"
        gap={2}
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        <GridItem colSpan={1} maxHeight="500px">
          <ReportProjectsByStatusWidget />
        </GridItem>
        <GridItem colSpan={2}>
          <ReportSkillsWidget />
        </GridItem>
      </Grid> */}
      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={5}>
        <GridItem colSpan={1} maxHeight="500px">
          <ReportProjectsByStatusWidget />
        </GridItem>
        <GridItem colSpan={{ base: 1, sm: 2 }}>
          <ReportSkillsWidget />
        </GridItem>
      </SimpleGrid>
    </>
  );
}
