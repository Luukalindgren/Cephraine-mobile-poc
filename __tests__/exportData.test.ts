import { logsToCSV, generateSummary } from '../utils/exportData';
import type { HeadacheLog } from '../types';

const sampleLogs: HeadacheLog[] = [
  {
    id: '1',
    date: '2026-03-15',
    severity: 7,
    type: 'migraine',
    painLocations: [
      { region: 'temple_left', intensity: 8 },
      { region: 'left_eye', intensity: 6 },
    ],
    durationMinutes: 180,
    notes: 'Triggered by bright light',
    triggers: ['bright_light', 'stress'],
    createdAt: '2026-03-15T10:00:00Z',
  },
  {
    id: '2',
    date: '2026-03-14',
    severity: 4,
    type: 'tension',
    painLocations: [{ region: 'forehead', intensity: 4 }],
    durationMinutes: 60,
    notes: '',
    triggers: ['screen_time'],
    createdAt: '2026-03-14T15:00:00Z',
  },
];

describe('logsToCSV', () => {
  it('should generate valid CSV with headers', () => {
    const csv = logsToCSV(sampleLogs);
    const lines = csv.split('\n');
    expect(lines[0]).toBe(
      'Date,Severity (1-10),Type,Pain Locations,Duration (minutes),Triggers,Notes'
    );
    expect(lines).toHaveLength(3);
  });

  it('should include pain locations with intensity', () => {
    const csv = logsToCSV(sampleLogs);
    expect(csv).toContain('Left Temple (8/10)');
    expect(csv).toContain('Left Eye (6/10)');
  });

  it('should handle empty logs', () => {
    const csv = logsToCSV([]);
    const lines = csv.split('\n');
    expect(lines).toHaveLength(1);
  });
});

describe('generateSummary', () => {
  it('should generate a summary with stats', () => {
    const summary = generateSummary(sampleLogs);
    expect(summary).toContain('Total entries: 2');
    expect(summary).toContain('Average severity: 5.5/10');
    expect(summary).toContain('Headache Log Summary');
  });

  it('should handle empty logs', () => {
    const summary = generateSummary([]);
    expect(summary).toBe('No headache logs recorded.');
  });
});
