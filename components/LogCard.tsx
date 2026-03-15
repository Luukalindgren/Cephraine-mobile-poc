import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Severity } from '../constants/theme';
import type { HeadacheLog } from '../types';
import { HEADACHE_TYPE_LABELS, HEAD_REGION_LABELS } from '../types';

interface LogCardProps {
  log: HeadacheLog;
  onDelete?: (id: string) => void;
}

export default function LogCard({ log, onDelete }: LogCardProps) {
  const formattedDate = new Date(log.date + 'T00:00:00').toLocaleDateString(
    'en-US',
    {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }
  );

  const durationText =
    log.durationMinutes >= 60
      ? `${Math.floor(log.durationMinutes / 60)}h ${log.durationMinutes % 60}m`
      : `${log.durationMinutes}m`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.dateRow}>
          <Text style={styles.date}>{formattedDate}</Text>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: Colors.primary + '22' },
            ]}
          >
            <Text style={styles.typeText}>
              {HEADACHE_TYPE_LABELS[log.type]}
            </Text>
          </View>
        </View>
        {onDelete && (
          <Pressable
            onPress={() => onDelete(log.id)}
            hitSlop={12}
            style={styles.deleteBtn}
          >
            <Ionicons name="trash-outline" size={18} color={Colors.textMuted} />
          </Pressable>
        )}
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <View
            style={[
              styles.severityDot,
              { backgroundColor: Severity.getColor(log.severity) },
            ]}
          />
          <Text style={styles.metricValue}>{log.severity}/10</Text>
          <Text style={styles.metricLabel}>severity</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metric}>
          <Ionicons
            name="time-outline"
            size={14}
            color={Colors.textSecondary}
          />
          <Text style={styles.metricValue}>{durationText}</Text>
          <Text style={styles.metricLabel}>duration</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metric}>
          <Ionicons
            name="location-outline"
            size={14}
            color={Colors.textSecondary}
          />
          <Text style={styles.metricValue}>
            {log.painLocations.length}
          </Text>
          <Text style={styles.metricLabel}>
            {log.painLocations.length === 1 ? 'region' : 'regions'}
          </Text>
        </View>
      </View>

      {log.painLocations.length > 0 && (
        <View style={styles.locations}>
          {log.painLocations.map((loc) => (
            <View key={loc.region} style={styles.locationChip}>
              <View
                style={[
                  styles.locationDot,
                  { backgroundColor: Severity.getColor(loc.intensity) },
                ]}
              />
              <Text style={styles.locationText}>
                {HEAD_REGION_LABELS[loc.region]}
              </Text>
            </View>
          ))}
        </View>
      )}

      {log.notes.trim() !== '' && (
        <Text style={styles.notes} numberOfLines={2}>
          {log.notes}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  date: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
  },
  typeText: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 4,
  },
  metrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metric: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  severityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  metricValue: {
    color: Colors.text,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  metricLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },
  locations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
  },
  locationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  locationText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
  },
  notes: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontStyle: 'italic',
  },
});
