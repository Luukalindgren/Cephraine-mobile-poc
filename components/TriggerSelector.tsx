import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import type { Trigger } from '../types';
import { TRIGGER_LABELS } from '../types';

const TRIGGER_ICONS: Record<Trigger, keyof typeof Ionicons.glyphMap> = {
  stress: 'flash',
  lack_of_sleep: 'moon',
  dehydration: 'water',
  screen_time: 'phone-portrait',
  weather: 'cloud',
  alcohol: 'wine',
  caffeine: 'cafe',
  skipped_meal: 'restaurant',
  bright_light: 'sunny',
  loud_noise: 'volume-high',
  exercise: 'fitness',
  hormonal: 'pulse',
  other: 'ellipsis-horizontal',
};

interface TriggerSelectorProps {
  selected: Trigger[];
  onToggle: (trigger: Trigger) => void;
}

export default function TriggerSelector({
  selected,
  onToggle,
}: TriggerSelectorProps) {
  const triggers = Object.keys(TRIGGER_LABELS) as Trigger[];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Triggers</Text>
      <View style={styles.grid}>
        {triggers.map((trigger) => {
          const isSelected = selected.includes(trigger);
          return (
            <Pressable
              key={trigger}
              onPress={() => onToggle(trigger)}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
              ]}
            >
              <Ionicons
                name={TRIGGER_ICONS[trigger]}
                size={14}
                color={isSelected ? Colors.primary : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}
              >
                {TRIGGER_LABELS[trigger]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  label: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.primary + '22',
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  chipTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
