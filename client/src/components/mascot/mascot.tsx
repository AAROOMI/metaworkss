import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, 
  MessageSquare, 
  X, 
  AlertCircle, 
  Lightbulb, 
  Award, 
  HelpCircle,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMascot } from '@/hooks/use-mascot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function SecurityMascot() {
  const { 
    currentMessage, 
    showMascot, 
    setShowMascot, 
    dismissMessage, 
    isSpeaking, 
    askMascot,
    mascotPersonality,
    setMascotPersonality 
  } = useMascot();
  
  const [question, setQuestion] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Text to speech for mascot messages
  useEffect(() => {
    if (voiceEnabled && currentMessage && isSpeaking) {
      const speech = new SpeechSynthesisUtterance(currentMessage.text);
      speech.rate = 1;
      speech.pitch = 1;
      speech.volume = 1;
      
      // Adjust voice based on personality
      if (mascotPersonality === 'serious') {
        speech.rate = 0.9;
        speech.pitch = 0.9;
      } else if (mascotPersonality === 'quirky') {
        speech.rate = 1.1;
        speech.pitch = 1.2;
      }
      
      window.speechSynthesis.speak(speech);
      
      return () => {
        window.speechSynthesis.cancel();
      };
    }
  }, [currentMessage, isSpeaking, voiceEnabled, mascotPersonality]);

  // Auto-scroll to the bottom of the message container
  useEffect(() => {
    if (messageRef.current && isExpanded) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [currentMessage, isExpanded]);

  if (!showMascot) return null;

  // Determine mascot appearance based on personality
  const getMascotIcon = () => {
    switch (mascotPersonality) {
      case 'serious':
        return <Shield className="h-10 w-10 text-blue-500" />;
      case 'quirky':
        return <Shield className="h-10 w-10 text-purple-500" />;
      case 'friendly':
      default:
        return <Shield className="h-10 w-10 text-green-500" />;
    }
  };

  // Get icon based on message type
  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'tip':
        return <Lightbulb className="h-5 w-5 text-amber-500" />;
      case 'achievement':
        return <Award className="h-5 w-5 text-primary" />;
      case 'guidance':
        return <HelpCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setIsAsking(true);
    await askMascot(question);
    setQuestion('');
    setIsAsking(false);
    
    // Focus back on input after response
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-80 rounded-lg border border-border bg-card shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-border p-3">
              <div className="flex items-center gap-2">
                {getMascotIcon()}
                <div>
                  <h3 className="font-medium">
                    {mascotPersonality === 'friendly' && "Security Buddy"}
                    {mascotPersonality === 'serious' && "Security Guardian"}
                    {mascotPersonality === 'quirky' && "Security Sidekick"}
                  </h3>
                  <p className="text-xs text-muted-foreground">Your compliance assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                >
                  {voiceEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-4" side="top">
                    <div className="space-y-4">
                      <h4 className="font-medium">Mascot Settings</h4>
                      
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Mascot Personality</h5>
                        <RadioGroup 
                          value={mascotPersonality} 
                          onValueChange={(val) => setMascotPersonality(val as any)}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="friendly" id="friendly" />
                            <Label htmlFor="friendly">Friendly</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="serious" id="serious" />
                            <Label htmlFor="serious">Serious</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="quirky" id="quirky" />
                            <Label htmlFor="quirky">Quirky</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h5 className="text-sm font-medium">Text-to-Speech</h5>
                          <p className="text-xs text-muted-foreground">Enable voice for mascot</p>
                        </div>
                        <Switch 
                          checked={voiceEnabled}
                          onCheckedChange={setVoiceEnabled}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setIsExpanded(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div 
              className="h-52 overflow-y-auto p-3 space-y-3" 
              ref={messageRef}
            >
              {currentMessage ? (
                <div className="flex gap-2 items-start rounded-lg bg-muted/50 p-3 animate-fadeIn">
                  {getMessageIcon(currentMessage.type)}
                  <div className="flex-1">
                    <p className="text-sm">{currentMessage.text}</p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-center text-sm text-muted-foreground">
                    I'm here to help with your security and compliance questions!
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitQuestion} className="border-t border-border p-3">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Ask me anything about security..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={isAsking}
                  className="text-sm"
                />
                <Button 
                  size="sm" 
                  type="submit" 
                  disabled={isAsking || !question.trim()}
                >
                  {isAsking ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    "Ask"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Avatar Button */}
      <div className="relative">
        {currentMessage && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute -top-12 right-0 w-60 rounded-lg bg-card p-2 text-xs shadow-lg border border-border"
          >
            <div className="flex items-start gap-2">
              {getMessageIcon(currentMessage.type)}
              <p className="flex-1 line-clamp-2">{currentMessage.text}</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 -mr-1 -mt-1"
                onClick={() => dismissMessage(currentMessage.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            mascotPersonality === 'friendly' ? 'bg-green-500' : 
            mascotPersonality === 'serious' ? 'bg-blue-500' : 'bg-purple-500'
          } text-white shadow-lg transition-colors duration-200`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <X className="h-6 w-6" />
          ) : (
            getMascotIcon()
          )}
        </motion.button>
      </div>
    </div>
  );
}