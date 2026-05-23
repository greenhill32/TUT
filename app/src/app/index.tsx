import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { ChatScreen } from '@/components/ChatScreen';
import magicMikeScenario from '@/scenarios/magicMike.json';

interface Message {
  id: string;
  sender: 'tracey' | 'user';
  text: string;
  timestamp?: string;
}

interface ScenarioMessage {
  delay_ms: number;
  sender?: 'tracey' | 'user';
  text?: string;
  type?: string;
  dismissal?: string;
}

interface Scenario {
  messages: ScenarioMessage[];
}

const magicMike = magicMikeScenario as Scenario;

const DISMISSALS = [
  'I know, but as I was saying...',
  'You don\'t say? Anyway...',
  'Christ on a bike, but...',
  'Fair point, but listen...',
  'Tell me about it, but here\'s the thing...',
  'Yeah but as I was saying...',
  'Anyway...',
  'Yeah anyway...',
];

function getRandomDismissal() {
  return DISMISSALS[Math.floor(Math.random() * DISMISSALS.length)];
}

export default function HomeScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState(0);

  useEffect(() => {
    let msgId = 0;

    const playScenario = (scenario: Scenario) => {
      const processMessage = (index: number) => {
        if (index >= scenario.messages.length) {
          return;
        }

        const msg = scenario.messages[index];

        if (msg.type === 'await_user_input') {
          setIsTyping(false);
          return;
        }

        if (msg.sender && msg.text) {
          const delay = msg.delay_ms || 0;

          if (msg.sender === 'tracey' && delay > 0) {
            setIsTyping(true);
          }

          setTimeout(() => {
            setIsTyping(false);
            const newMessage: Message = {
              id: `msg-${Date.now()}-${msgId++}`,
              sender: msg.sender as 'tracey' | 'user',
              text: msg.text || '',
            };
            setMessages((prev) => [...prev, newMessage]);
            processMessage(index + 1);
          }, delay);
        } else {
          processMessage(index + 1);
        }
      };

      processMessage(0);
    };

    playScenario(magicMike);

    return () => {
      // Cleanup timeouts if component unmounts
    };
  }, []);

  const handleSendMessage = (text: string) => {
    // Add user message
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
    };
    setMessages((prev) => [...prev, newMessage]);

    // Continue to next message in scenario
    const currentMsgIndex = scenarioIndex + 1;
    if (currentMsgIndex < magicMike.messages.length) {
      setScenarioIndex(currentMsgIndex);
      setIsTyping(true);

      // After a short delay, add Tracey's dismissal and continue
      setTimeout(() => {
        const nextMsg = magicMike.messages[currentMsgIndex];
        if (nextMsg.text) {
          const dismissal = getRandomDismissal();
          const responseText = nextMsg.dismissal ? `${nextMsg.dismissal}\n${nextMsg.text}` : nextMsg.text;

          const dismissalMsg: Message = {
            id: `msg-${Date.now()}`,
            sender: 'tracey',
            text: dismissal,
          };
          setMessages((prev) => [...prev, dismissalMsg]);

          setTimeout(() => {
            const responseMsg: Message = {
              id: `msg-${Date.now()}`,
              sender: 'tracey',
              text: responseText,
            };
            setMessages((prev) => [...prev, responseMsg]);
            setIsTyping(false);
          }, 2000);
        }
      }, 1500);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ChatScreen messages={messages} onSendMessage={handleSendMessage} isTyping={isTyping} />
    </View>
  );
}
