import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RadarCard from '@/components/RadarCard';
import { colors as themeColors, typography, radius, spacing, shadows } from '@/lib/theme';
import { useStore, type Radar } from '@/lib/store';
import { mediumImpact } from '@/lib/haptics';

// Mock radars
const MOCK_RADARS: Radar[] = [
  {
    id: 'r1',
    name: 'Senior React Roles',
    query: 'Senior Frontend/React Engineer at top-tier companies, remote-friendly, $150K+',
    filters: { skills: ['React', 'TypeScript'], remote: true },
    matchCount: 23,
    active: true,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'r2',
    name: 'Full-Stack Startups',
    query: 'Full-stack engineer at Series A-C startups in SF/NYC, equity-heavy comp',
    filters: { location: ['SF', 'NYC'], stage: 'startup' },
    matchCount: 14,
    active: true,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: 'r3',
    name: 'FAANG+ Opportunities',
    query: 'Software engineer at FAANG or equivalent, L5+, any location',
    filters: { companies: ['Google', 'Meta', 'Apple', 'Amazon', 'Netflix'] },
    matchCount: 8,
    active: false,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
];

export default function RadarScreen() {
  const darkMode = useStore((s) => s.darkMode);
  const c = darkMode ? themeColors.dark : themeColors.light;
  const { radars, setRadars, addRadar, toggleRadar } = useStore();

  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQuery, setNewQuery] = useState('');

  // Initialize with mocks if empty
  React.useEffect(() => {
    if (radars.length === 0) {
      setRadars(MOCK_RADARS);
    }
  }, []);

  const handleCreate = async () => {
    if (!newName.trim() || !newQuery.trim()) return;
    await mediumImpact();
    addRadar({
      id: `r-${Date.now()}`,
      name: newName.trim(),
      query: newQuery.trim(),
      filters: {},
      matchCount: 0,
      active: true,
      createdAt: new Date().toISOString(),
    });
    setNewName('');
    setNewQuery('');
    setShowModal(false);
  };

  const handlePress = (radar: Radar) => {
    // Navigate to radar results feed
  };

  const activeCount = radars.filter((r) => r.active).length;
  const totalMatches = radars.filter((r) => r.active).reduce((sum, r) => sum + r.matchCount, 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: c.text }]}>Radar</Text>
          <Text style={[styles.headerSubtitle, { color: c.textSecondary }]}>
            {activeCount} active, {totalMatches} total matches
          </Text>
        </View>
        <Pressable
          onPress={() => setShowModal(true)}
          style={[styles.createButton, { backgroundColor: c.primary }]}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>New</Text>
        </Pressable>
      </View>

      {/* Radar List */}
      <FlatList
        data={radars}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RadarCard radar={item} onPress={handlePress} onToggle={toggleRadar} />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="radio-outline" size={64} color={c.textTertiary} />
            <Text style={[styles.emptyTitle, { color: c.text }]}>No radars yet</Text>
            <Text style={[styles.emptySubtitle, { color: c.textSecondary }]}>
              Create a radar to get notified about matching jobs
            </Text>
          </View>
        }
      />

      {/* Create Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: c.overlay }]}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: c.card, ...shadows.lg },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: c.text }]}>New Radar</Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={c.textSecondary} />
              </Pressable>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: c.textSecondary }]}>Name</Text>
                <TextInput
                  style={[
                    styles.modalInput,
                    { color: c.text, backgroundColor: c.surface, borderColor: c.border },
                  ]}
                  placeholder="e.g. Remote React Roles"
                  placeholderTextColor={c.textTertiary}
                  value={newName}
                  onChangeText={setNewName}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: c.textSecondary }]}>
                  What are you looking for?
                </Text>
                <TextInput
                  style={[
                    styles.modalInput,
                    styles.textArea,
                    { color: c.text, backgroundColor: c.surface, borderColor: c.border },
                  ]}
                  placeholder="Describe your ideal role in natural language..."
                  placeholderTextColor={c.textTertiary}
                  value={newQuery}
                  onChangeText={setNewQuery}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <Pressable
                onPress={handleCreate}
                disabled={!newName.trim() || !newQuery.trim()}
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: c.primary,
                    opacity: !newName.trim() || !newQuery.trim() ? 0.5 : 1,
                  },
                ]}
              >
                <Ionicons name="radio" size={18} color="#FFFFFF" />
                <Text style={styles.modalButtonText}>Create Radar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: radius.base,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    padding: spacing.base,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  modalForm: {
    gap: spacing.lg,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: radius.base,
    paddingHorizontal: spacing.base,
    height: 48,
    fontSize: 15,
  },
  textArea: {
    height: 100,
    paddingTop: spacing.md,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    borderRadius: radius.base,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
