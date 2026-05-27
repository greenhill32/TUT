import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { Phone, Video } from 'lucide-react-native';
import { theme, chatColors, typography } from '../lib/theme';

interface Message {
  id: string;
  sender: 'tracey' | 'user';
  text: string;
  timestamp?: string;
}

interface ReplyOption {
  id: string;
  label: string;
  nextBeatId: string;
}

interface ChatScreenProps {
  messages: Message[];
  isTyping?: boolean;
  replyOptions: ReplyOption[] | null;
  selectedReplyId: string | null;
  replyDisabled: boolean;
  onSelectReply: (option: ReplyOption) => void;
  onResetSession: () => void;
}

type ChatListItem =
  | (Message & { isLastOfRun: boolean; type?: 'message' })
  | { id: 'typing-indicator'; type: 'typing' };

const ChatHeader = ({ onResetSession }: { onResetSession: () => void }) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.backButton} onPress={onResetSession} accessibilityRole="button" accessibilityLabel="Reset chat">
      <Text style={{ fontSize: 16, color: theme.accent }}>‹</Text>
    </TouchableOpacity>
    <View style={styles.avatarContainer}>
      <View style={[styles.avatar, { backgroundColor: theme.hot }]}>
        <Text style={styles.avatarText}>T</Text>
      </View>
    </View>
    <View style={styles.headerInfo}>
      <Text style={[styles.headerName, typography.headerName]}>Tracey</Text>
      <Text style={[styles.headerStatus, typography.headerStatus]}>last seen typing forever</Text>
    </View>
    <View style={styles.headerIcons}>
      <TouchableOpacity style={styles.iconButton}>
        <Phone size={20} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <Video size={20} color="#000" />
      </TouchableOpacity>
    </View>
  </View>
);

const MessageBubble = ({ message, isLastOfRun }: { message: Message; isLastOfRun: boolean }) => {
  const isUser = message.sender === 'user';
  const bubbleStyle = isUser ? styles.userBubble : styles.traceyBubble;
  const textStyle = isUser ? styles.userText : styles.traceyText;

  return (
    <View style={[styles.messageLine, isUser && styles.userMessageLine]}>
      <View
        style={[
          styles.bubble,
          bubbleStyle,
          {
            borderBottomLeftRadius: !isUser && isLastOfRun ? 5 : 18,
            borderBottomRightRadius: isUser && isLastOfRun ? 5 : 18,
          },
        ]}
      >
        <Text style={[styles.messageText, textStyle, typography.messageText]}>
          {message.text}
        </Text>
      </View>
    </View>
  );
};

const AnimatedDot = ({ delay }: { delay: number }) => {
  const animValue = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(animValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animValue, delay]);

  const scale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <Animated.View
      style={[
        styles.typingDot,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  );
};

const TypingBubble = () => (
  <View style={styles.messageLine}>
    <View style={[styles.bubble, styles.traceyBubble, { borderBottomLeftRadius: 5 }]}>
      <View style={styles.typingIndicator}>
        {[0, 1, 2].map((i) => (
          <AnimatedDot key={i} delay={i * 150} />
        ))}
      </View>
    </View>
  </View>
);

const ReplyPills = ({
  replyOptions,
  selectedReplyId,
  replyDisabled,
  onSelectReply,
}: {
  replyOptions: ReplyOption[];
  selectedReplyId: string | null;
  replyDisabled: boolean;
  onSelectReply: (option: ReplyOption) => void;
}) => {
  const opacityValuesRef = useRef<Animated.Value[]>([]);
  const translateValuesRef = useRef<Animated.Value[]>([]);
  const selectedShiftRef = useRef(new Animated.Value(0));

  if (opacityValuesRef.current.length !== replyOptions.length) {
    opacityValuesRef.current = replyOptions.map(() => new Animated.Value(0));
    translateValuesRef.current = replyOptions.map(() => new Animated.Value(10));
    selectedShiftRef.current = new Animated.Value(0);
  }

  useEffect(() => {
    const animations = replyOptions.map((_, index) =>
      Animated.parallel([
        Animated.timing(opacityValuesRef.current[index], {
          toValue: 1,
          duration: 180,
          delay: index * 80,
          useNativeDriver: true,
        }),
        Animated.timing(translateValuesRef.current[index], {
          toValue: 0,
          duration: 180,
          delay: index * 80,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(80, animations).start();
  }, [replyOptions]);

  useEffect(() => {
    if (!selectedReplyId) {
      selectedShiftRef.current.setValue(0);
      return;
    }

    Animated.timing(selectedShiftRef.current, {
      toValue: 44,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [selectedReplyId]);

  return (
    <View style={styles.replyContainer}>
      {replyOptions.map((option, index) => {
        const isSelected = selectedReplyId === option.id;
        return (
          <Animated.View
            key={option.id}
            style={{
              opacity: opacityValuesRef.current[index],
              transform: [
                { translateY: translateValuesRef.current[index] },
                { translateX: isSelected ? selectedShiftRef.current : 0 },
              ],
            }}
          >
            <TouchableOpacity
              style={[styles.replyPill, isSelected && styles.replyPillSelected]}
              disabled={replyDisabled}
              onPress={() => onSelectReply(option)}
              accessibilityRole="button"
              accessibilityLabel={option.label}
            >
              <Text style={[styles.replyPillText, isSelected && styles.replyPillTextSelected]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
};

export const ChatScreen = ({
  messages,
  isTyping = false,
  replyOptions,
  selectedReplyId,
  replyDisabled,
  onSelectReply,
  onResetSession,
}: ChatScreenProps) => {
  const flatListRef = useRef<FlatList>(null);

  const displayMessages = messages.map((msg, idx, arr) => ({
    ...msg,
    isLastOfRun:
      (idx === arr.length - 1 && !isTyping) ||
      (idx < arr.length - 1 && arr[idx + 1]?.sender !== msg.sender),
  }));

  const chatItems: ChatListItem[] = isTyping
    ? [...displayMessages, { id: 'typing-indicator', type: 'typing' }]
    : displayMessages;

  const renderItem = ({ item }: { item: ChatListItem }) => {
    if (item.type === 'typing') {
      return <TypingBubble />;
    }

    return <MessageBubble message={item} isLastOfRun={item.isLastOfRun} />;
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [chatItems.length, isTyping, replyOptions?.length, selectedReplyId]);

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader onResetSession={onResetSession} />
      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={chatItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          scrollEnabled
          onEndReachedThreshold={0.1}
        />
        {replyOptions && replyOptions.length > 0 ? (
          <ReplyPills
            replyOptions={replyOptions}
            selectedReplyId={selectedReplyId}
            replyDisabled={replyDisabled}
            onSelectReply={onSelectReply}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: chatColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: chatColors.separator,
    backgroundColor: '#fafafa',
  },
  backButton: {
    paddingRight: 8,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    marginBottom: 2,
  },
  headerStatus: {
    marginTop: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 6,
  },
  messagesContainer: {
    flex: 1,
    minHeight: 0,
  },
  messagesList: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  messageLine: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  userMessageLine: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  traceyBubble: {
    backgroundColor: chatColors.traceyBubble,
  },
  userBubble: {
    backgroundColor: theme.hot,
  },
  traceyText: {
    color: chatColors.traceyText,
  },
  userText: {
    color: chatColors.userText,
  },
  messageText: {
    lineHeight: 18,
  },
  typingIndicator: {
    flexDirection: 'row',
    gap: 4,
    paddingVertical: 3,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#999',
  },
  replyContainer: {
    paddingHorizontal: 10,
    paddingTop: 4,
    paddingBottom: 10,
    alignItems: 'flex-start',
    gap: 6,
  },
  replyPill: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.18)',
    borderRadius: 999,
    paddingVertical: 11,
    paddingHorizontal: 20,
    marginVertical: 6,
    minWidth: 140,
    alignSelf: 'flex-start',
  },
  replyPillSelected: {
    backgroundColor: theme.hot,
    borderWidth: 0,
    alignSelf: 'flex-end',
    borderRadius: 22,
  },
  replyPillText: {
    color: '#222',
    fontSize: 14,
  },
  replyPillTextSelected: {
    color: '#fff',
  },
});


