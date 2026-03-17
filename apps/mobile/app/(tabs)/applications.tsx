import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ApplicationCard from '@/components/ApplicationCard';
import { colors as themeColors, typography, radius, spacing, shadows } from '@/lib/theme';
import { useStore, type Application } from '@/lib/store';
import { selectionFeedback } from '@/lib/haptics';

const STATUS_FILTERS: { value: Application['status'] | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'applied', label: 'Applied' },
  { value: 'screening', label: 'Screening' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
];

const STATUS_OPTIONS: Application['status'][] = [
  'applied',
  'screening',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
];

export default function ApplicationsScreen() {
  const darkMode = useStore((s) => s.darkMode);
  const c = darkMode ? themeColors.dark : themeColors.light;
  const { applications, updateStatus } = useStore();

  const [filter, setFilter] = useState<Application['status'] | 'all'>('all');
  const [statusPickerId, setStatusPickerId] = useState<string | null>(null);

  const filteredApps =
    filter === 'all'
      ? applications
      : applications.filter((a) => a.status === filter);

  const stats = {
    total: applications.length,
    active: applications.filter((a) => !['rejected', 'withdrawn'].includes(a.status)).length,
    interviews: applications.filter((a) => a.status === 'interview').length,
    offers: applications.filter((a) => a.status === 'offer').length,
  };

  const handleStatusChange = (id: string) => {
    setStatusPickerId(id);
  };

  const handleStatusSelect = async (status: Application['status']) => {
    if (statusPickerId) {
      await selectionFeedback();
      updateStatus(statusPickerId, status);
      setStatusPickerId(null);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: c.text }]}>Applications</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Total', value: stats.total, color: c.primary },
          { label: 'Active', value: stats.active, color: c.success },
          { label: 'Interviews', value: stats.interviews, color: c.warning },
          { label: 'Offers', value: stats.offers, color: c.emerald },
        ].map((stat) => (
          <View
            key={stat.label}
            style={[styles.statCard, { backgroundColor: c.surface }]}
          >
            <Text style={[styles.statValue, { color: stat.color }]}>
              {stat.value}
            </Text>
            <Text style={[styles.statLabel, { color: c.textSecondary }]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Segmented Control */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {STATUS_FILTERS.map((f) => (
          <Pressable
            key={f.value}
            onPress={() => {
              setFilter(f.value);
              selectionFeedback();
            }}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter === f.value ? c.primary : c.surface,
                borderColor: filter === f.value ? c.primary : c.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === f.value ? '#FFFFFF' : c.textSecondary },
              ]}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* List */}
      <FlatList
        data={filteredApps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ApplicationCard
            application={item}
            onStatusChange={handleStatusChange}
          />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="briefcase-outline" size={64} color={c.textTertiary} />
            <Text style={[styles.emptyTitle, { color: c.text }]}>No applications yet</Text>
            <Text style={[styles.emptySubtitle, { color: c.textSecondary }]}>
              Swipe up on a job to quick-apply
            </Text>
          </View>
        }
      />

      {/* Status Picker Bottom Sheet */}
      <Modal visible={!!statusPickerId} transparent animationType="slide">
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: c.overlay }]}
          onPress={() => setStatusPickerId(null)}
        >
          <View
            style={[
              styles.statusSheet,
              { backgroundColor: c.card, ...shadows.lg },
            ]}
          >
            <View style={styles.sheetHandle}>
              <View style={[styles.handle, { backgroundColor: c.border }]} />
            </View>
            <Text style={[styles.sheetTitle, { color: c.text }]}>
              Update Status
            </Text>
            {STATUS_OPTIONS.map((status) => (
              <Pressable
                key={status}
                onPress={() => handleStatusSelect(status)}
                style={[styles.statusOption, { borderBottomColor: c.borderLight }]}
              >
                <Text style={[styles.statusOptionText, { color: c.text }]}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
                <Ionicons name="chevron-forward" size={18} color={c.textTertiary} />
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.base,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  filterRow: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    padding: spacing.base,
    paddingBottom: spacing['4xl'],
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  statusSheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  sheetHandle: {
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.base,
  },
  statusOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statusOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
