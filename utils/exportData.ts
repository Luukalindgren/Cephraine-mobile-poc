import type { HeadacheLog } from '../types';
import { HEAD_REGION_LABELS, HEADACHE_TYPE_LABELS, TRIGGER_LABELS } from '../types';

export function logsToCSV(logs: HeadacheLog[]): string {
  const headers = [
    'Date',
    'Severity (1-10)',
    'Type',
    'Pain Locations',
    'Duration (minutes)',
    'Triggers',
    'Notes',
  ];

  const rows = logs.map((log) => [
    log.date,
    log.severity.toString(),
    HEADACHE_TYPE_LABELS[log.type],
    log.painLocations
      .map((p) => `${HEAD_REGION_LABELS[p.region]} (${p.intensity}/10)`)
      .join('; '),
    log.durationMinutes.toString(),
    log.triggers.map((t) => TRIGGER_LABELS[t]).join('; '),
    `"${log.notes.replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function generateSummary(logs: HeadacheLog[]): string {
  if (logs.length === 0) return 'No headache logs recorded.';

  const avgSeverity =
    logs.reduce((sum, l) => sum + l.severity, 0) / logs.length;
  const avgDuration =
    logs.reduce((sum, l) => sum + l.durationMinutes, 0) / logs.length;

  const typeCounts = logs.reduce(
    (acc, l) => {
      acc[l.type] = (acc[l.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const mostCommonType = Object.entries(typeCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const triggerCounts = logs.reduce(
    (acc, l) => {
      l.triggers.forEach((t) => {
        acc[t] = (acc[t] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  const topTriggers = Object.entries(triggerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const lines = [
    `Headache Log Summary`,
    `====================`,
    `Period: ${logs[logs.length - 1].date} to ${logs[0].date}`,
    `Total entries: ${logs.length}`,
    `Average severity: ${avgSeverity.toFixed(1)}/10`,
    `Average duration: ${Math.round(avgDuration)} minutes`,
    `Most common type: ${HEADACHE_TYPE_LABELS[mostCommonType[0] as keyof typeof HEADACHE_TYPE_LABELS]} (${mostCommonType[1]} occurrences)`,
    ``,
    `Top triggers:`,
    ...topTriggers.map(
      ([t, count]) =>
        `  - ${TRIGGER_LABELS[t as keyof typeof TRIGGER_LABELS]}: ${count} times`
    ),
  ];

  return lines.join('\n');
}
