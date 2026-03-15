import { useHeadacheStore } from '../store/headacheStore';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

beforeEach(() => {
  useHeadacheStore.setState({
    logs: [],
    draft: {
      severity: 5,
      type: 'tension',
      painLocations: [],
      durationMinutes: 60,
      notes: '',
      triggers: [],
    },
  });
});

describe('headacheStore', () => {
  it('should update draft severity', () => {
    useHeadacheStore.getState().updateDraft({ severity: 8 });
    expect(useHeadacheStore.getState().draft.severity).toBe(8);
  });

  it('should toggle pain location on', () => {
    useHeadacheStore.getState().togglePainLocation('forehead', 7);
    const locations = useHeadacheStore.getState().draft.painLocations;
    expect(locations).toHaveLength(1);
    expect(locations[0]).toEqual({ region: 'forehead', intensity: 7 });
  });

  it('should toggle pain location off', () => {
    useHeadacheStore.getState().togglePainLocation('forehead', 7);
    useHeadacheStore.getState().togglePainLocation('forehead');
    expect(useHeadacheStore.getState().draft.painLocations).toHaveLength(0);
  });

  it('should toggle triggers', () => {
    useHeadacheStore.getState().toggleTrigger('stress');
    expect(useHeadacheStore.getState().draft.triggers).toContain('stress');
    useHeadacheStore.getState().toggleTrigger('stress');
    expect(useHeadacheStore.getState().draft.triggers).not.toContain('stress');
  });

  it('should save draft and create a log entry', () => {
    const store = useHeadacheStore.getState();
    store.updateDraft({ severity: 7, type: 'migraine', notes: 'bad one' });
    store.togglePainLocation('temple_left', 8);

    const saved = useHeadacheStore.getState().saveDraft();
    expect(saved.severity).toBe(7);
    expect(saved.type).toBe('migraine');
    expect(saved.painLocations).toHaveLength(1);

    const logs = useHeadacheStore.getState().logs;
    expect(logs).toHaveLength(1);
    expect(logs[0].id).toBe(saved.id);

    expect(useHeadacheStore.getState().draft.severity).toBe(5);
  });

  it('should delete a log', () => {
    useHeadacheStore.getState().togglePainLocation('crown', 5);
    const saved = useHeadacheStore.getState().saveDraft();
    expect(useHeadacheStore.getState().logs).toHaveLength(1);

    useHeadacheStore.getState().deleteLog(saved.id);
    expect(useHeadacheStore.getState().logs).toHaveLength(0);
  });

  it('should reset draft to defaults', () => {
    useHeadacheStore.getState().updateDraft({ severity: 9, notes: 'test' });
    useHeadacheStore.getState().resetDraft();
    const draft = useHeadacheStore.getState().draft;
    expect(draft.severity).toBe(5);
    expect(draft.notes).toBe('');
  });
});
