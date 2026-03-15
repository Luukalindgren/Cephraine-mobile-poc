import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHeadacheStore } from '../../store/headacheStore';
import { logsToCSV, generateSummary } from '../../utils/exportData';
import {
  Colors,
  Spacing,
  FontSize,
  BorderRadius,
} from '../../constants/theme';

export default function ExportScreen() {
  const logs = useHeadacheStore((s) => s.logs);
  const [preview, setPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExportCSV = async () => {
    if (logs.length === 0) {
      alert('No logs to export. Start logging headaches first!');
      return;
    }

    const csv = logsToCSV(logs);

    if (Platform.OS === 'web') {
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cephraine-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      try {
        const FileSystem = await import('expo-file-system');
        const Sharing = await import('expo-sharing');
        const fileUri =
          FileSystem.documentDirectory +
          `cephraine-export-${new Date().toISOString().split('T')[0]}.csv`;
        await FileSystem.writeAsStringAsync(fileUri, csv);
        await Sharing.shareAsync(fileUri);
      } catch {
        alert('Export failed. Please try again.');
      }
    }
  };

  const handleShowSummary = () => {
    if (logs.length === 0) {
      alert('No logs to summarize.');
      return;
    }
    setPreview(generateSummary(logs));
  };

  const handleShowCSVPreview = () => {
    if (logs.length === 0) {
      alert('No logs to preview.');
      return;
    }
    setPreview(logsToCSV(logs));
  };

  const handleCopyToClipboard = async () => {
    if (!preview) return;
    if (Platform.OS === 'web') {
      await navigator.clipboard.writeText(preview);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Ionicons name="document-text" size={48} color={Colors.primary} />
        <Text style={styles.title}>Export Your Data</Text>
        <Text style={styles.subtitle}>
          Share your headache logs with your doctor or healthcare provider.
        </Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>
          {logs.length} {logs.length === 1 ? 'entry' : 'entries'} available
        </Text>
        {logs.length > 0 && (
          <Text style={styles.statsRange}>
            {logs[logs.length - 1].date} → {logs[0].date}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={handleExportCSV}>
          <View style={styles.actionIcon}>
            <Ionicons name="download-outline" size={24} color={Colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Download CSV</Text>
            <Text style={styles.actionDesc}>
              Spreadsheet format for your doctor
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textMuted}
          />
        </Pressable>

        <Pressable style={styles.actionBtn} onPress={handleShowSummary}>
          <View style={styles.actionIcon}>
            <Ionicons
              name="stats-chart-outline"
              size={24}
              color={Colors.primary}
            />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>View Summary</Text>
            <Text style={styles.actionDesc}>
              Quick overview of your patterns
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textMuted}
          />
        </Pressable>

        <Pressable style={styles.actionBtn} onPress={handleShowCSVPreview}>
          <View style={styles.actionIcon}>
            <Ionicons name="eye-outline" size={24} color={Colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Preview CSV</Text>
            <Text style={styles.actionDesc}>
              See what will be exported
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textMuted}
          />
        </Pressable>
      </View>

      {preview && (
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>Preview</Text>
            <Pressable
              style={styles.copyBtn}
              onPress={handleCopyToClipboard}
            >
              <Ionicons
                name={copied ? 'checkmark' : 'copy-outline'}
                size={16}
                color={copied ? Colors.success : Colors.primary}
              />
              <Text
                style={[
                  styles.copyText,
                  copied && { color: Colors.success },
                ]}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Text>
            </Pressable>
          </View>
          <ScrollView
            style={styles.previewScroll}
            horizontal
            showsHorizontalScrollIndicator
          >
            <Text style={styles.previewText}>{preview}</Text>
          </ScrollView>
        </View>
      )}

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
  header: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statsTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  statsRange: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  actions: {
    gap: Spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  actionDesc: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  previewCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  previewTitle: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary + '15',
  },
  copyText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  previewScroll: {
    maxHeight: 300,
    padding: Spacing.md,
  },
  previewText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 18,
  },
});
