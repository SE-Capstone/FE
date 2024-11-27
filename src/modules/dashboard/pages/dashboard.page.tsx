import { Grid, GridItem } from '@chakra-ui/react';
import Chart from 'chart.js/auto';

import StatsWithIcons from '../widgets/card-stat.widget';
import { ReportProjectsByStatusWidget } from '../widgets/report-project-by-status.widget';
import { ReportSkillsWidget } from '../widgets/report-skills.widget';

Chart.register();

export function DashboardPage() {
  return (
    <>
      <StatsWithIcons />
      <Grid
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
      </Grid>
    </>
  );
}
