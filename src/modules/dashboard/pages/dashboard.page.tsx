// import {
//   Chart as ChartJS,
//   LinearScale,
//   CategoryScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from 'chart.js';
import Chart from 'chart.js/auto';

import { ReportSkillsWidget } from '../widgets/report-skills.widget';

Chart.register();
// ChartJS.register(
//   LinearScale,
//   CategoryScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Legend,
//   Tooltip
// );

export function DashboardPage() {
  return <ReportSkillsWidget />;
}
