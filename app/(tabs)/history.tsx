import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHeadacheStore } from '../../store/headacheStore';
import LogCard from '../../components/LogCard';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';

export default function HistoryScreen() {
  const logs = useHeadacheStore((s) => s.logs);
  const deleteLog = useHeadacheStore((s) => s.deleteLog);

  const handleDelete = (id: string) => {
    const doDelete = () => deleteLog(id);
    if (Platform.OS === 'web') {
      if (confirm('Delete this headache log?')) doDelete();
    } else {
      Alert.alert('Delete Log', 'Are you sure you want to delete this entry?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  if (logs.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons
          name="calendar-outline"
          size={64}
          color={Colors.textMuted}
        />
        <Text style={styles.emptyTitle}>No Entries Yet</Text>
        <Text style={styles.emptySubtitle}>
          Log your first headache in the Log tab to start tracking.
        </Text>
      </View>
    );
  }

  const avgSeverity = (
    logs.reduce((s, l) => s + l.severity, 0) / logs.length
  ).toFixed(1);

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{logs.length}</Text>
          <Text style={styles.statLabel}>total entries</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{avgSeverity}</Text>
          <Text style={styles.statLabel}>avg severity</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {logs.length > 0 ? logs[0].date.slice(5) : '—'}
          </Text>
          <Text style={styles.statLabel}>latest</Text>
        </View>
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LogCard log={item} onDelete={handleDelete} />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  summary: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  list: {
    padding: Spacing.md,
    paddingTop: 0,
    paddingBottom: 40,
  },
  empty: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 22,
  },
});
