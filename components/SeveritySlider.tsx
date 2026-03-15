import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Severity, Spacing, FontSize, BorderRadius } from '../constants/theme';

interface SeveritySliderProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export default function SeveritySlider({
  value,
  onChange,
  label = 'Severity',
}: SeveritySliderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <View
          style={[
            styles.valueBadge,
            { backgroundColor: Severity.getColor(value) + '22' },
          ]}
        >
          <Text
            style={[styles.valueText, { color: Severity.getColor(value) }]}
          >
            {value}/10 — {Severity.getLabel(value)}
          </Text>
        </View>
      </View>
      <View style={styles.track}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
          <Pressable
            key={level}
            onPress={() => onChange(level)}
            style={[
              styles.segment,
              {
                backgroundColor:
                  level <= value
                    ? Severity.getColor(level)
                    : Colors.surfaceHighlight,
                borderTopLeftRadius: level === 1 ? BorderRadius.sm : 0,
                borderBottomLeftRadius: level === 1 ? BorderRadius.sm : 0,
                borderTopRightRadius: level === 10 ? BorderRadius.sm : 0,
                borderBottomRightRadius: level === 10 ? BorderRadius.sm : 0,
              },
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                {
                  color: level <= value ? Colors.white : Colors.textMuted,
                },
              ]}
            >
              {level}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  valueBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
  },
  valueText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  track: {
    flexDirection: 'row',
    gap: 2,
  },
  segment: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
});
