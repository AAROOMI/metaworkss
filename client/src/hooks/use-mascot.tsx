import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

type MascotMessageType = 'tip' | 'alert' | 'achievement' | 'guidance';

interface MascotMessage {
  id: string;
  text: string;
  type: MascotMessageType;
  dismissed?: boolean;
  createdAt: Date;
}

interface MascotContextType {
  messages: MascotMessage[];
  currentMessage: MascotMessage | null;
  showMascot: boolean;
  isSpeaking: boolean;
  setShowMascot: (show: boolean) => void;
  dismissMessage: (id: string) => void;
  dismissAllMessages: () => void;
  addMessage: (text: string, type?: MascotMessageType) => void;
  askMascot: (question: string) => Promise<string>;
  mascotPersonality: 'friendly' | 'serious' | 'quirky';
  setMascotPersonality: (personality: 'friendly' | 'serious' | 'quirky') => void;
}

const MascotContext = createContext<MascotContextType | undefined>(undefined);

export function MascotProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<MascotMessage[]>([]);
  const [showMascot, setShowMascot] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mascotPersonality, setMascotPersonality] = useState<'friendly' | 'serious' | 'quirky'>('friendly');
  const { toast } = useToast();

  const currentMessage = messages.find(m => !m.dismissed) || null;

  // Auto-dismiss messages after they've been shown for a while
  useEffect(() => {
    if (currentMessage && !currentMessage.dismissed) {
      const timer = setTimeout(() => {
        dismissMessage(currentMessage.id);
      }, 60000); // Auto-dismiss after 60 seconds
      
      return () => clearTimeout(timer);
    }
  }, [currentMessage]);

  const dismissMessage = useCallback((id: string) => {
    setMessages(prevMessages => 
      prevMessages.map(m => 
        m.id === id ? { ...m, dismissed: true } : m
      )
    );
    setIsSpeaking(false);
  }, []);

  const dismissAllMessages = useCallback(() => {
    setMessages(prevMessages => 
      prevMessages.map(m => ({ ...m, dismissed: true }))
    );
    setIsSpeaking(false);
  }, []);

  const addMessage = useCallback((text: string, type: MascotMessageType = 'tip') => {
    const newMessage: MascotMessage = {
      id: Date.now().toString(),
      text,
      type,
      dismissed: false,
      createdAt: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsSpeaking(true);
    
    // For important alerts, also show a toast
    if (type === 'alert') {
      toast({
        title: 'Security Alert',
        description: text,
        variant: 'destructive',
      });
    } else if (type === 'achievement') {
      toast({
        title: 'Achievement Unlocked',
        description: text,
        variant: 'default',
      });
    }
  }, [toast]);

  const askMascot = useCallback(async (question: string): Promise<string> => {
    setIsSpeaking(true);
    
    try {
      const response = await apiRequest('POST', '/api/mascot/ask', { 
        question,
        personality: mascotPersonality
      });
      
      const data = await response.json();
      const answer = data.answer;
      
      addMessage(answer, 'guidance');
      return answer;
    } catch (error) {
      console.error('Error asking mascot:', error);
      const errorMessage = 'Sorry, I encountered an issue processing your question. Please try again later.';
      addMessage(errorMessage, 'alert');
      return errorMessage;
    } finally {
      setIsSpeaking(false);
    }
  }, [addMessage, mascotPersonality]);

  const value = {
    messages,
    currentMessage,
    showMascot,
    isSpeaking,
    setShowMascot,
    dismissMessage,
    dismissAllMessages,
    addMessage,
    askMascot,
    mascotPersonality,
    setMascotPersonality
  };

  return (
    <MascotContext.Provider value={value}>
      {children}
    </MascotContext.Provider>
  );
}

export function useMascot() {
  const context = useContext(MascotContext);
  if (context === undefined) {
    throw new Error('useMascot must be used within a MascotProvider');
  }
  return context;
}