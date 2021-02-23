import { ComboChartLabel, ComboChartParam } from './dashboard.enum';

/** Key value pair for combo-chart option dropdown */
export const ComboChartDrop: { key: string, value: number }[] = [
    { key: ComboChartLabel.Monthly, value: ComboChartParam.Monthly },
    { key: ComboChartLabel.Quarterly, value: ComboChartParam.Quarterly },
    { key: ComboChartLabel.Annually, value: ComboChartParam.Annually },
]

/** Donut Chart Legends defined as constants for Copyit and Bookit  */
export const DonutChartLegend: string[] = [
    'Open',
    'In Progress',
    'Closed',
];

/** Donut Chart fleet Legends defined as constants  */
export const DonutFleetLegends: string[] = ['Operable', 'InOperable'];

/** Bar Chart  Legends for client status defined as constants  */
export const ClientLegends: string[] = [
    'Company Name',
    'New',
    'Assigned',
    'In Progress',
    'Completed',
    'Re-Open',
    'Request For Information',
    'On-Hold',
    'Closed',
];

/** Bar Chart  Legends for associate status defined as constants  */
export const AssociateLegends: any[] = [
    'Company Name',
    'Assigned',
    'In Progress',
    'Completed',
    'Request For Information',
    'On-Hold',
    'Closed',
    { role: 'annotation' },
];

/** Combo Chart  Legends for Copyit,Bookit and fleet defined as constants  */
export const ComboChartLegends: string[] = [
    'Month',
    'Received Request',
    'Completed Request',
];