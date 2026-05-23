import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { Phone, Video, Send, Plus, Mic } from 'lucide-react-native';
import { theme, chatColors, typography } from '../lib/theme';

interface Message {
  id: string;
  sender: 'tracey' | 'user';
  text: string;
  timestamp?: string;
}

interface ChatScreenProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping?: boolean;
}

type ChatListItem =
  | (Message & { isLastOfRun: boolean; type?: 'message' })
  | { id: 'typing-indicator'; type: 'typing' };

const StatusBar = ({ time = '14:07' }) => (
  <View style={styles.statusBar}>
    <Text style={styles.statusTime}>{time}</Text>
    <View style={styles.statusIcons}>
      {/* Signal bars */}
      <View style={{ flexDirection: 'row', gap: 1, marginRight: 8 }}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={{
              width: 3,
              height: 2 + i,
              backgroundColor: '#000',
              borderRadius: 0.5,
            }}
          />
        ))}
      </View>
      {/* WiFi */}
      <View style={{ width: 15, height: 11, marginRight: 8 }}>
        <Text style={{ fontSize: 10 }}>📶</Text>
      </View>
      {/* Battery */}
      <View style={{ width: 26, height: 12, borderWidth: 1, borderColor: '#000', borderRadius: 2, marginRight: 4 }}>
        <View style={{ flex: 1, backgroundColor: '#000' }} />
        <View style={{ width: 2, height: 6, backgroundColor: '#000', position: 'absolute', right: -3, top: 3 }} />
      </View>
    </View>
  </View>
);

const ChatHeader = () => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.backButton}>
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

const InputBar = ({ onSendMessage }: { onSendMessage: (text: string) => void }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity style={styles.addButton}>
        <Plus size={20} color={theme.hot} />
      </TouchableOpacity>
      <TextInput
        style={styles.textInput}
        placeholder="iMessage"
        placeholderTextColor="rgba(0,0,0,0.35)"
        value={text}
        onChangeText={setText}
        multiline
      />
      <TouchableOpacity style={styles.micButton}>
        <Mic size={18} color="rgba(0,0,0,0.5)" />
      </TouchableOpacity>
      {text.trim() ? (
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Send size={18} color="#fff" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export const ChatScreen = ({ messages, onSendMessage, isTyping = false }: ChatScreenProps) => {
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
    if (chatItems.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [chatItems.length, isTyping]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <ChatHeader />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={chatItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          scrollEnabled
          onEndReachedThreshold={0.1}
        />
      </KeyboardAvoidingView>
      <InputBar onSendMessage={onSendMessage} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: chatColors.background,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: chatColors.background,
  },
  statusTime: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  messagesList: {
    flexGrow: 1,
    justifyContent: 'flex-start',
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
    backgroundColor: chatColors.userBubble,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexShrink: 0,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 7,
    backgroundColor: '#fafafa',
    borderTopWidth: 0.5,
    borderTopColor: chatColors.separator,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    color: 'rgba(0,0,0,0.4)',
    fontWeight: '300',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.12)',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
    maxHeight: 100,
  },
  micButton: {
    fontSize: 16,
    padding: 6,
  },
  sendButton: {
    padding: 6,
  },
  sendButtonText: {
    fontSize: 20,
    color: theme.accent,
    fontWeight: 'bold',
  },
});
