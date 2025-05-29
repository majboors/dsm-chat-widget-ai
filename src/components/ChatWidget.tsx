
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, RotateCcw, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatInstance {
  instance_id: string;
  email: string;
  software_name: string;
  created_at: string;
}

interface SessionData {
  email: string;
  chatInstance: ChatInstance | null;
  messages: Message[];
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentStep, setCurrentStep] = useState<'form' | 'chat'>('form');
  const [email, setEmail] = useState('');
  const [softwareName, setSoftwareName] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatInstance, setChatInstance] = useState<ChatInstance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Session storage key
  const SESSION_KEY = 'chat-widget-session';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load session data on component mount
  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      try {
        const sessionData: SessionData = JSON.parse(savedSession);
        setEmail(sessionData.email);
        if (sessionData.chatInstance && sessionData.messages.length > 0) {
          setChatInstance(sessionData.chatInstance);
          setMessages(sessionData.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
          setCurrentStep('chat');
        }
      } catch (error) {
        console.error('Error loading session:', error);
      }
    }
  }, []);

  // Save session data whenever relevant state changes
  useEffect(() => {
    if (email) {
      const sessionData: SessionData = {
        email,
        chatInstance,
        messages
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    }
  }, [email, chatInstance, messages]);

  const createChatInstance = async () => {
    if (!email || !softwareName) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://chat.techrealm.pk/instance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          software_name: softwareName
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create chat instance');
      }

      const instance = await response.json();
      setChatInstance(instance);
      setCurrentStep('chat');
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `Hello! I'm here to help you with ${softwareName}. How can I assist you today?`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      
      toast.success('Chat started successfully!');
    } catch (error) {
      console.error('Error creating chat instance:', error);
      toast.error('Failed to start chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !chatInstance) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`https://chat.techrealm.pk/instance/${chatInstance.instance_id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: data.response_id || Date.now().toString(),
        content: data.answer,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setCurrentStep('form');
    setSoftwareName('');
    setMessages([]);
    setInputMessage('');
    setChatInstance(null);
    // Clear session data
    localStorage.removeItem(SESSION_KEY);
    toast.success('Chat reset successfully');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentStep === 'form') {
        createChatInstance();
      } else {
        sendMessage();
      }
    }
  };

  return (
    <>
      {/* Chat Widget Button */}
      <div className="fixed left-4 bottom-4 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <MessageCircle size={24} />
          </Button>
        )}
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div className={`fixed left-4 bottom-4 z-50 transition-all duration-300 ${
          isMinimized 
            ? 'w-80 h-16' 
            : 'w-full sm:w-80 sm:h-[500px] max-w-none sm:max-w-sm'
        }`}>
          <div className={`${
            isMinimized
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-2xl border border-blue-500 h-16 flex items-center px-4'
              : window.innerWidth < 640
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-2xl border border-blue-500 min-h-16 flex flex-col overflow-hidden max-h-96'
                : 'bg-white rounded-2xl shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden'
          }`}>
            
            {/* Mobile Bubble Interface */}
            {window.innerWidth < 640 && !isMinimized ? (
              <div className="text-white p-4 w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <img 
                      src="https://wordpress.techrealm.online/images/97a08179-1527-41b3-b8ff-0f681c89e043.png" 
                      alt="DSM Logo" 
                      className="w-6 h-6 object-contain bg-white rounded p-1"
                    />
                    <div>
                      <h3 className="font-semibold text-sm">Digital Software Market AI</h3>
                      <p className="text-xs text-blue-100">We're here to help!</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(true)}
                      className="text-white hover:bg-blue-600 p-1 h-8 w-8"
                    >
                      <Minimize2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-blue-600 p-1 h-8 w-8"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>

                {currentStep === 'form' ? (
                  /* Mobile Form */
                  <div className="space-y-3">
                    <div>
                      <Input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="text-sm bg-white/10 border-white/20 text-white placeholder-white/70"
                      />
                    </div>
                    
                    <div>
                      <Input
                        placeholder="Software you need help with"
                        value={softwareName}
                        onChange={(e) => setSoftwareName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="text-sm bg-white/10 border-white/20 text-white placeholder-white/70"
                      />
                    </div>
                    
                    <Button
                      onClick={createChatInstance}
                      disabled={isLoading || !email || !softwareName}
                      className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
                    >
                      {isLoading ? 'Starting Chat...' : 'Start Chat'}
                    </Button>
                  </div>
                ) : (
                  /* Mobile Chat */
                  <div className="space-y-3">
                    {/* Chat Info */}
                    <div className="flex justify-between items-center text-xs text-blue-100">
                      <span className="truncate flex-1 mr-2">
                        <span className="font-medium">{softwareName}</span> • {email}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetChat}
                        className="text-white hover:bg-blue-600 p-1 h-6 w-6"
                      >
                        <RotateCcw size={12} />
                      </Button>
                    </div>

                    {/* Messages Area */}
                    <div className="bg-white/10 rounded-2xl p-3 max-h-48 overflow-y-auto">
                      <div className="space-y-2">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[85%] p-2 rounded-xl text-xs ${
                                message.sender === 'user'
                                  ? 'bg-white text-blue-600'
                                  : 'bg-blue-800 text-white'
                              }`}
                            >
                              {message.sender === 'bot' ? (
                                <ReactMarkdown
                                  components={{
                                    a: ({ href, children }) => (
                                      <a 
                                        href={href} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-200 hover:text-blue-100 underline"
                                      >
                                        {children}
                                      </a>
                                    ),
                                    p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                                  }}
                                >
                                  {message.content}
                                </ReactMarkdown>
                              ) : (
                                message.content
                              )}
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-blue-800 p-2 rounded-xl">
                              <div className="flex space-x-1">
                                <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 text-sm bg-white/10 border-white/20 text-white placeholder-white/70"
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="bg-white/20 hover:bg-white/30 text-white px-3"
                      >
                        <Send size={14} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Desktop Interface or Minimized State */
              <>
                {/* Minimized Header */}
                {isMinimized ? (
                  <div className="flex items-center justify-between w-full text-white">
                    <div className="flex items-center gap-2">
                      <img 
                        src="https://wordpress.techrealm.online/images/97a08179-1527-41b3-b8ff-0f681c89e043.png" 
                        alt="DSM Logo" 
                        className="w-6 h-6 object-contain bg-white rounded p-1"
                      />
                      <div>
                        <h3 className="font-semibold text-sm">Digital Software Market AI</h3>
                        <p className="text-xs text-blue-100">We're here to help!</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-blue-600 p-1 h-8 w-8"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Desktop Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 flex items-center justify-between rounded-t-2xl">
                      <div className="flex items-center gap-2">
                        <img 
                          src="https://wordpress.techrealm.online/images/97a08179-1527-41b3-b8ff-0f681c89e043.png" 
                          alt="DSM Logo" 
                          className="w-6 h-6 md:w-8 md:h-8 object-contain bg-white rounded p-1"
                        />
                        <div>
                          <h3 className="font-semibold text-sm">Digital Software Market AI</h3>
                          <p className="text-xs text-blue-100">We're here to help!</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsMinimized(!isMinimized)}
                          className="text-white hover:bg-blue-600 p-1 h-8 w-8"
                        >
                          <Minimize2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsOpen(false)}
                          className="text-white hover:bg-blue-600 p-1 h-8 w-8"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>

                    {/* Desktop Content */}
                    {currentStep === 'form' ? (
                      /* Desktop Form */
                      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        <div className="text-center">
                          <h4 className="font-semibold text-gray-800 mb-2">Welcome to Digital Software Market AI</h4>
                          <p className="text-sm text-gray-600">Please provide your details to start chatting</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onKeyPress={handleKeyPress}
                              className="text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Software Query</label>
                            <Input
                              placeholder="e.g., Microsoft Office, AutoCAD, etc."
                              value={softwareName}
                              onChange={(e) => setSoftwareName(e.target.value)}
                              onKeyPress={handleKeyPress}
                              className="text-sm"
                            />
                          </div>
                        </div>
                        
                        <Button
                          onClick={createChatInstance}
                          disabled={isLoading || !email || !softwareName}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                        >
                          {isLoading ? 'Starting Chat...' : 'Start Chat'}
                        </Button>
                      </div>
                    ) : (
                      /* Desktop Chat Interface */
                      <>
                        {/* Chat Header Info */}
                        <div className="px-4 py-2 bg-gray-50 border-b flex justify-between items-center">
                          <div className="text-xs text-gray-600 truncate flex-1 mr-2">
                            <span className="font-medium">{softwareName}</span> • {email}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetChat}
                            className="text-gray-500 hover:text-gray-700 p-1 h-6 w-6"
                          >
                            <RotateCcw size={12} />
                          </Button>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4">
                          <div className="space-y-3">
                            {messages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                    message.sender === 'user'
                                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md'
                                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                                  }`}
                                >
                                  {message.sender === 'bot' ? (
                                    <div className="prose prose-sm max-w-none">
                                      <ReactMarkdown
                                        components={{
                                          a: ({ href, children }) => (
                                            <a 
                                              href={href} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="text-blue-600 hover:text-blue-800 underline"
                                            >
                                              {children}
                                            </a>
                                          ),
                                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                          ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                                          ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                                          li: ({ children }) => <li className="mb-1">{children}</li>,
                                        }}
                                      >
                                        {message.content}
                                      </ReactMarkdown>
                                    </div>
                                  ) : (
                                    message.content
                                  )}
                                </div>
                              </div>
                            ))}
                            {isLoading && (
                              <div className="flex justify-start">
                                <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-md">
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div ref={messagesEndRef} />
                          </div>
                        </ScrollArea>

                        {/* Input */}
                        <div className="p-4 border-t bg-white rounded-b-2xl">
                          <div className="flex gap-2">
                            <Textarea
                              placeholder="Type your message..."
                              value={inputMessage}
                              onChange={(e) => setInputMessage(e.target.value)}
                              onKeyPress={handleKeyPress}
                              className="flex-1 min-h-[40px] max-h-[80px] resize-none rounded-2xl border-gray-200"
                              rows={1}
                            />
                            <Button
                              onClick={sendMessage}
                              disabled={!inputMessage.trim() || isLoading}
                              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 rounded-2xl"
                            >
                              <Send size={16} />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
