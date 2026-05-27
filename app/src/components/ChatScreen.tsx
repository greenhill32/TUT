import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Animated, Image, ImageSourcePropType } from 'react-native';
import { Phone, Play, Video } from 'lucide-react-native';
import { theme, chatColors, typography } from '../lib/theme';

interface Message {
  id: string;
  sender: 'tracey' | 'dave' | 'user';
  text?: string;
  type?: 'message' | 'voice-note' | 'image';
  durationLabel?: string;
  transcript?: string;
  filename?: string;
  caption?: string;
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
  | (Message & { isLastOfRun: boolean; isFirstOfRun: boolean })
  | { id: 'typing-indicator'; renderType: 'typing' };

type MessageListItem = Message & { isLastOfRun: boolean; isFirstOfRun: boolean };

const chatMediaAssets: Record<string, ImageSourcePropType> = {
  'tesco-selfie-blurry.png': require('../../assets/s01e01/tesco-selfie-blurry.png'),
  'hermes-bag-bloodstain.png': require('../../assets/s01e01/hermes-bag-bloodstain.png'),
  'handcuffs.png': require('../../assets/s01e01/handcuffs.png'),
};

const isTypingItem = (item: ChatListItem): item is { id: 'typing-indicator'; renderType: 'typing' } =>
  'renderType' in item && item.renderType === 'typing';

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

const VoiceNoteBubble = ({ message, bubbleStyle }: { message: Message; bubbleStyle: object }) => {
  const waveformBars = [14, 24, 12, 30, 18, 26, 10, 22, 16, 28, 12, 20, 15, 25, 11, 19];

  return (
    <View
      style={[styles.bubble, styles.voiceBubble, bubbleStyle]}
      accessibilityLabel={`Voice note ${message.durationLabel ?? ''}. ${message.transcript ?? ''}`}
    >
      <View style={styles.playButton}>
        <Play size={15} color="#111" fill="#111" />
      </View>
      <View style={styles.voiceMeta}>
        <View style={styles.waveform}>
          {waveformBars.map((height, index) => (
            <View key={`${message.id}-bar-${index}`} style={[styles.waveformBar, { height }]} />
          ))}
        </View>
        <Text style={styles.voiceDuration}>{message.durationLabel ?? '0:00'}</Text>
      </View>
    </View>
  );
};

const ImageBubble = ({ message, bubbleStyle }: { message: Message; bubbleStyle: object }) => {
  const source = message.filename ? chatMediaAssets[message.filename] : undefined;

  if (!source) {
    return (
      <View style={[styles.bubble, bubbleStyle]}>
        <Text style={[styles.messageText, styles.traceyText, typography.messageText]}>
          {message.caption ?? 'Photo unavailable'}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.mediaBubble, bubbleStyle]}>
      <Image source={source} style={styles.mediaImage} resizeMode="cover" accessibilityLabel={message.caption} />
      {message.caption ? <Text style={styles.mediaCaption}>{message.filename}</Text> : null}
    </View>
  );
};

const MessageBubble = ({
  message,
  isLastOfRun,
  isFirstOfRun,
}: {
  message: Message;
  isLastOfRun: boolean;
  isFirstOfRun: boolean;
}) => {
  const isUser = message.sender === 'user';
  const isDave = message.sender === 'dave';
  const bubbleStyle = isUser ? styles.userBubble : isDave ? styles.daveBubble : styles.traceyBubble;
  const textStyle = isUser ? styles.userText : styles.traceyText;
  const messageType = message.type ?? 'message';

  const bubbleRadiusStyle = {
    borderBottomLeftRadius: !isUser && isLastOfRun ? 5 : 18,
    borderBottomRightRadius: isUser && isLastOfRun ? 5 : 18,
  };

  const content =
    messageType === 'voice-note' ? (
      <VoiceNoteBubble message={message} bubbleStyle={[bubbleStyle, bubbleRadiusStyle]} />
    ) : messageType === 'image' ? (
      <ImageBubble message={message} bubbleStyle={[bubbleStyle, bubbleRadiusStyle]} />
    ) : (
      <View style={[styles.bubble, bubbleStyle, bubbleRadiusStyle]}>
        <Text style={[styles.messageText, textStyle, typography.messageText]}>
          {message.text}
        </Text>
      </View>
    );

  return (
    <View style={[styles.messageLine, isUser && styles.userMessageLine]}>
      <View style={[styles.messageStack, isUser && styles.userMessageStack]}>
        {isDave && isFirstOfRun ? <Text style={styles.senderLabel}>Dave</Text> : null}
        {content}
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
    isFirstOfRun: idx === 0 || arr[idx - 1]?.sender !== msg.sender,
    isLastOfRun:
      (idx === arr.length - 1 && !isTyping) ||
      (idx < arr.length - 1 && arr[idx + 1]?.sender !== msg.sender),
  }));

  const chatItems: ChatListItem[] = isTyping
    ? [...displayMessages, { id: 'typing-indicator', renderType: 'typing' }]
    : displayMessages;

  const renderItem = ({ item }: { item: ChatListItem }) => {
    if (isTypingItem(item)) {
      return <TypingBubble />;
    }

    const messageItem = item as MessageListItem;
    return <MessageBubble message={messageItem} isLastOfRun={messageItem.isLastOfRun} isFirstOfRun={messageItem.isFirstOfRun} />;
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
  messageStack: {
    maxWidth: '75%',
  },
  userMessageStack: {
    alignItems: 'flex-end',
  },
  senderLabel: {
    alignSelf: 'flex-start',
    marginLeft: 9,
    marginBottom: 2,
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.48)',
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  traceyBubble: {
    backgroundColor: chatColors.traceyBubble,
  },
  daveBubble: {
    backgroundColor: '#dff2d8',
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
  voiceBubble: {
    minWidth: 210,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 9,
  },
  playButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceMeta: {
    flex: 1,
    gap: 4,
  },
  waveform: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  waveformBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  voiceDuration: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.52)',
  },
  mediaBubble: {
    overflow: 'hidden',
    borderRadius: 18,
    width: 240,
  },
  mediaImage: {
    width: '100%',
    height: 220,
  },
  mediaCaption: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 11,
    color: 'rgba(0,0,0,0.58)',
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


