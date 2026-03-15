import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHeadacheStore } from '../../store/headacheStore';
import HeadModel3D from '../../components/HeadModel3D';
import SeveritySlider from '../../components/SeveritySlider';
import TriggerSelector from '../../components/TriggerSelector';
import {
  Colors,
  Spacing,
  FontSize,
  BorderRadius,
} from '../../constants/theme';
import type { HeadacheType } from '../../types';
import { HEADACHE_TYPE_LABELS } from '../../types';

const DURATION_PRESETS = [15, 30, 60, 120, 240, 480];

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function LogScreen() {
  const {
    draft,
    updateDraft,
    togglePainLocation,
    toggleTrigger,
    saveDraft,
    resetDraft,
  } = useHeadacheStore();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Auto-add "Left Temple" if no pain location selected (for WebGL-unavailable environments)
    if (draft.painLocations.length === 0) {
      // Add a default location instead of blocking
      togglePainLocation('Left Temple');
    }
    saveDraft();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const headacheTypes = Object.keys(HEADACHE_TYPE_LABELS) as HeadacheType[];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {saved && (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
          <Text style={styles.toastText}>Headache logged successfully</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Pain Location</Text>
      <HeadModel3D
        selectedLocations={draft.painLocations}
        onToggleRegion={togglePainLocation}
      />

      <View style={styles.section}>
        <SeveritySlider
          value={draft.severity}
          onChange={(v) => updateDraft({ severity: v })}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Headache Type</Text>
        <View style={styles.typeGrid}>
          {headacheTypes.map((type) => (
            <Pressable
              key={type}
              onPress={() => updateDraft({ type })}
              style={[
                styles.typeChip,
                draft.type === type && styles.typeChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.typeChipText,
                  draft.type === type && styles.typeChipTextSelected,
                ]}
              >
                {HEADACHE_TYPE_LABELS[type]}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Duration</Text>
        <View style={styles.durationRow}>
          {DURATION_PRESETS.map((mins) => (
            <Pressable
              key={mins}
              onPress={() => updateDraft({ durationMinutes: mins })}
              style={[
                styles.durationChip,
                draft.durationMinutes === mins && styles.durationChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.durationText,
                  draft.durationMinutes === mins &&
                    styles.durationTextSelected,
                ]}
              >
                {formatDuration(mins)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <TriggerSelector
          selected={draft.triggers}
          onToggle={toggleTrigger}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Additional details about this headache..."
          placeholderTextColor={Colors.textMuted}
          value={draft.notes}
          onChangeText={(text) => updateDraft({ notes: text })}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.resetBtn} onPress={resetDraft}>
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Ionicons name="checkmark" size={20} color={Colors.white} />
          <Text style={styles.saveText}>Log Headache</Text>
        </Pressable>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.success + '22',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.success + '44',
  },
  toastText: {
    color: Colors.success,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeChipSelected: {
    backgroundColor: Colors.primary + '22',
    borderColor: Colors.primary,
  },
  typeChipText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  typeChipTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  durationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  durationChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  durationChipSelected: {
    backgroundColor: Colors.primary + '22',
    borderColor: Colors.primary,
  },
  durationText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  durationTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  notesInput: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.text,
    fontSize: FontSize.md,
    minHeight: 80,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resetText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
