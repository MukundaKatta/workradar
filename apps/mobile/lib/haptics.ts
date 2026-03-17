import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const isHapticsAvailable = Platform.OS === 'ios' || Platform.OS === 'android';

export async function lightImpact(): Promise<void> {
  if (!isHapticsAvailable) return;
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export async function mediumImpact(): Promise<void> {
  if (!isHapticsAvailable) return;
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export async function heavyImpact(): Promise<void> {
  if (!isHapticsAvailable) return;
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}

export async function successNotification(): Promise<void> {
  if (!isHapticsAvailable) return;
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export async function errorNotification(): Promise<void> {
  if (!isHapticsAvailable) return;
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

export async function warningNotification(): Promise<void> {
  if (!isHapticsAvailable) return;
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}

export async function selectionFeedback(): Promise<void> {
  if (!isHapticsAvailable) return;
  await Haptics.selectionAsync();
}
