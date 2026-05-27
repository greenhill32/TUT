import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ChatScreen } from '@/components/ChatScreen';
import tescoThingScenario from '@/scenarios/tescoThing.json';

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

interface StoryBeat {
  id: string;
  from: 'tracey' | 'dave' | 'user' | 'system';
  text?: string;
  type?: 'message' | 'voice-note' | 'image';
  durationLabel?: string;
  transcript?: string;
  filename?: string;
  caption?: string;
  delayMs?: number;
  nextBeatId?: string;
  replyOptions?: ReplyOption[];
}

interface Scenario {
  startBeatId: string;
  beats: StoryBeat[];
}

const scenario = tescoThingScenario as Scenario;

export default function HomeScreen() {
  const { reset } = useLocalSearchParams<{ reset?: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [replyOptions, setReplyOptions] = useState<ReplyOption[] | null>(null);
  const [selectedReplyId, setSelectedReplyId] = useState<string | null>(null);
  const [replyDisabled, setReplyDisabled] = useState(false);
  const msgCounterRef = useRef(0);
  const timeoutsRef = useRef<number[]>([]);

  const beatMap = useMemo(() => {
    const map = new Map<string, StoryBeat>();
    scenario.beats.forEach((beat) => map.set(beat.id, beat));
    return map;
  }, []);

  const appendMessage = (message: Omit<Message, 'id'>) => {
    msgCounterRef.current += 1;
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}-${msgCounterRef.current}`,
        ...message,
      },
    ]);
  };

  const playBeat = (beatId?: string) => {
    if (!beatId) {
      setIsTyping(false);
      return;
    }

    const beat = beatMap.get(beatId);
    if (!beat) {
      setIsTyping(false);
      return;
    }

    const delay = beat.delayMs ?? 0;
    if ((beat.from === 'tracey' || beat.from === 'dave') && delay > 0) {
      setIsTyping(true);
    }

    const timeoutId = setTimeout(() => {
      if (beat.from === 'tracey' || beat.from === 'dave' || beat.from === 'user') {
        appendMessage({
          sender: beat.from,
          text: beat.text,
          type: beat.type ?? 'message',
          durationLabel: beat.durationLabel,
          transcript: beat.transcript,
          filename: beat.filename,
          caption: beat.caption,
        });
      }
      setIsTyping(false);

      if (beat.replyOptions && beat.replyOptions.length > 0) {
        setReplyOptions(beat.replyOptions);
        setSelectedReplyId(null);
        setReplyDisabled(false);
        return;
      }

      playBeat(beat.nextBeatId);
    }, delay);
    timeoutsRef.current.push(timeoutId as unknown as number);
  };

  const clearAllTimers = () => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  };

  const startScenario = () => {
    clearAllTimers();
    setMessages([]);
    setIsTyping(false);
    setReplyOptions(null);
    setSelectedReplyId(null);
    setReplyDisabled(false);
    msgCounterRef.current = 0;
    playBeat(scenario.startBeatId);
  };

  useEffect(() => {
    startScenario();
    return () => clearAllTimers();
  }, []);

  useEffect(() => {
    if (reset) {
      startScenario();
    }
  }, [reset]);

  const handleSelectReply = (option: ReplyOption) => {
    if (replyDisabled) {
      return;
    }

    setSelectedReplyId(option.id);
    setReplyDisabled(true);

    const outerTimeoutId = setTimeout(() => {
      appendMessage({ sender: 'user', text: option.label, type: 'message' });
      setReplyOptions(null);
      setSelectedReplyId(null);

      const innerTimeoutId = setTimeout(() => {
        playBeat(option.nextBeatId);
      }, 180);
      timeoutsRef.current.push(innerTimeoutId as unknown as number);
    }, 180);
    timeoutsRef.current.push(outerTimeoutId as unknown as number);
  };

  return (
    <View style={{ flex: 1 }}>
      <ChatScreen
        messages={messages}
        isTyping={isTyping}
        replyOptions={replyOptions}
        selectedReplyId={selectedReplyId}
        replyDisabled={replyDisabled}
        onSelectReply={handleSelectReply}
        onResetSession={startScenario}
      />
    </View>
  );
}
