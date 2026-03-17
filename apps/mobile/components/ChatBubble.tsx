import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors as themeColors, typography, radius, spacing } from '@/lib/theme';
import { useStore, type ChatMessage } from '@/lib/store';

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const darkMode = useStore((s) => s.darkMode);
  const c = darkMode ? themeColors.dark : themeColors.light;

  const isUser = message.role === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      <View
        style={[
          styles.bubble,
          isUser
            ? [styles.userBubble, { backgroundColor: c.primary }]
            : [styles.assistantBubble, { backgroundColor: c.surface, borderColor: c.border }],
        ]}
      >
        <Text
          style={[
            styles.text,
            { color: isUser ? '#FFFFFF' : c.text },
          ]}
        >
          {message.content}
        </Text>
      </View>
      <Text
        style={[
          styles.timestamp,
          { color: c.textTertiary },
          isUser ? styles.userTimestamp : styles.assistantTimestamp,
        ]}
      >
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.base,
    maxWidth: '85%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  assistantContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  userBubble: {
    borderBottomRightRadius: spacing.xs,
  },
  assistantBubble: {
    borderBottomLeftRadius: spacing.xs,
    borderWidth: 1,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 2,
  },
  userTimestamp: {
    textAlign: 'right',
  },
  assistantTimestamp: {
    textAlign: 'left',
  },
});
