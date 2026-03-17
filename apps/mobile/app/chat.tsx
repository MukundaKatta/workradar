import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ChatBubble from '@/components/ChatBubble';
import { colors as themeColors, typography, radius, spacing } from '@/lib/theme';
import { useStore, type ChatMessage } from '@/lib/store';
import { lightImpact } from '@/lib/haptics';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm your AI Career Coach. I know your profile, skills, and preferences. Ask me anything about career strategy, interview prep, salary negotiation, skill development, or job search tactics.",
  timestamp: new Date().toISOString(),
};

export default function ChatScreen() {
  const darkMode = useStore((s) => s.darkMode);
  const c = darkMode ? themeColors.dark : themeColors.light;
  const { messages, isTyping, addMessage, setTyping } = useStore();

  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const allMessages = [WELCOME_MESSAGE, ...messages];

  useEffect(() => {
    if (allMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [allMessages.length]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    await lightImpact();
    setInput('');

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMessage);

    // Simulate AI response
    setTyping(true);
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: generateMockResponse(text),
        timestamp: new Date().toISOString(),
      };
      addMessage(aiResponse);
      setTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: c.border }]}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="close" size={24} color={c.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <View style={[styles.botAvatar, { backgroundColor: c.primary }]}>
            <Ionicons name="sparkles" size={16} color="#FFFFFF" />
          </View>
          <Text style={[styles.headerTitle, { color: c.text }]}>AI Career Coach</Text>
        </View>
        <View style={styles.headerButton} />
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={allMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingContainer}>
                <View
                  style={[
                    styles.typingBubble,
                    { backgroundColor: c.surface, borderColor: c.border },
                  ]}
                >
                  <ActivityIndicator size="small" color={c.primary} />
                  <Text style={[styles.typingText, { color: c.textSecondary }]}>
                    Thinking...
                  </Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* Quick Actions */}
        {messages.length === 0 && (
          <View style={styles.quickActions}>
            {[
              'How should I negotiate my salary?',
              'What skills should I learn next?',
              'How do I prepare for system design interviews?',
              'Review my career trajectory',
            ].map((q) => (
              <Pressable
                key={q}
                onPress={() => {
                  setInput(q);
                  handleSend();
                }}
                style={[
                  styles.quickAction,
                  { backgroundColor: c.surface, borderColor: c.border },
                ]}
              >
                <Text style={[styles.quickActionText, { color: c.text }]}>
                  {q}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Input */}
        <View style={[styles.inputBar, { backgroundColor: c.card, borderTopColor: c.border }]}>
          <TextInput
            style={[
              styles.textInput,
              { color: c.text, backgroundColor: c.surface, borderColor: c.border },
            ]}
            placeholder="Ask anything..."
            placeholderTextColor={c.textTertiary}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={2000}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <Pressable
            onPress={handleSend}
            disabled={!input.trim()}
            style={[
              styles.sendButton,
              {
                backgroundColor: input.trim() ? c.primary : c.border,
              },
            ]}
          >
            <Ionicons
              name="arrow-up"
              size={20}
              color={input.trim() ? '#FFFFFF' : c.textTertiary}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function generateMockResponse(question: string): string {
  const lower = question.toLowerCase();
  if (lower.includes('salary') || lower.includes('negotiate')) {
    return "Based on your profile as a Senior Engineer, here are key negotiation strategies:\n\n1. Research market rates - for your skill set, the range is typically $170K-$250K in major tech hubs.\n\n2. Lead with your value - highlight specific impact you've driven: revenue generated, efficiency improvements, or projects led.\n\n3. Consider total comp - base salary, equity, signing bonus, and benefits. Sometimes a lower base with strong equity can be more valuable.\n\n4. Practice your pitch and have a specific number in mind. Would you like me to help you prepare talking points for a specific company?";
  }
  if (lower.includes('skill') || lower.includes('learn')) {
    return "Based on your current skill profile and market trends, I recommend focusing on:\n\n1. System Design - This is the biggest gap in your profile and critical for senior+ roles. Start with Designing Data-Intensive Applications by Martin Kleppmann.\n\n2. Cloud Architecture (AWS/GCP) - 78% of roles you're targeting require cloud expertise.\n\n3. AI/ML Fundamentals - Even for non-ML roles, understanding AI tools and integrations is increasingly valuable.\n\nWant me to create a personalized learning roadmap for any of these?";
  }
  if (lower.includes('interview') || lower.includes('prepare')) {
    return "For system design interview prep, here's a structured approach:\n\n1. Master the framework: Requirements gathering, high-level design, deep dive, trade-offs.\n\n2. Study core concepts: Load balancing, caching, database sharding, message queues, CDNs.\n\n3. Practice common problems: URL shortener, news feed, chat system, video streaming.\n\n4. Recommended resources: System Design Interview by Alex Xu, and Educative's Grokking course.\n\nShall I walk through a practice problem with you?";
  }
  return "That's a great question. Based on your profile and career goals, I'd recommend taking a strategic approach. Your strongest assets are your React and TypeScript expertise, combined with your experience level.\n\nI'd suggest focusing on roles that leverage these strengths while offering growth in areas like system design and cloud architecture.\n\nWould you like me to dive deeper into any specific aspect of your career strategy?";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: spacing.md,
  },
  typingContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  typingText: {
    fontSize: 14,
  },
  quickActions: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  quickAction: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: radius.base,
    borderWidth: 1,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    fontSize: 15,
    maxHeight: 120,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
});
