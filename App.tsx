import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, MessageRole, ChatSession } from './types';
import { runQuery } from './services/geminiService';
import Header from './components/Header';
import Message from './components/Message';
import ChatInput from './components/ChatInput';
import ChatHistory from './components/ChatHistory';
import { Spinner } from './components/icons';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('chatSessions');
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions);
        setSessions(parsedSessions);
        setActiveSessionId(parsedSessions[0]?.id || null);
      } else {
        handleNewSession();
      }
    } catch (e) {
      console.error("Failed to load sessions from localStorage", e);
      handleNewSession();
    }
  }, []);

  useEffect(() => {
    if(sessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
    }
  }, [sessions]);
  
  const activeSession = sessions.find(s => s.id === activeSessionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, isLoading]);
  
  const createNewSession = (): ChatSession => {
    const newSessionId = crypto.randomUUID();
    return {
      id: newSessionId,
      title: 'New Chat',
      messages: [
        {
          id: crypto.randomUUID(),
          role: MessageRole.AI,
          text: "Hello! I'm Mo_Bot. You can ask me questions, or upload an image for analysis. Toggle 'Web Search' for up-to-date answers.",
        },
      ],
    };
  };

  const handleNewSession = () => {
    const newSession = createNewSession();
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };
  
  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setSidebarOpen(false);
  };
  
  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
        const remainingSessions = sessions.filter(s => s.id !== id);
        if (remainingSessions.length > 0) {
            setActiveSessionId(remainingSessions[0].id);
        } else {
            handleNewSession();
        }
    }
  };

  const handleSendMessage = async (text: string, file: File | null, useWebSearch: boolean) => {
    if (!activeSessionId) return;

    setIsLoading(true);
    setError(null);
    
    const userMessage: ChatMessage = { 
        id: crypto.randomUUID(),
        role: MessageRole.USER, 
        text 
    };
    if (file) {
      userMessage.image = {
          url: URL.createObjectURL(file),
          name: file.name
      };
    }
    
    const isNewChat = activeSession?.messages.length === 1;

    setSessions(prev => prev.map(s => 
      s.id === activeSessionId 
        ? { 
            ...s, 
            title: isNewChat && text.trim() ? text.substring(0, 30) : s.title,
            messages: [...s.messages, userMessage] 
          }
        : s
    ));


    try {
      const response = await runQuery(text, file, useWebSearch);
      
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: MessageRole.AI,
        text: response.text,
        sources: response.sources,
      };
      
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId 
          ? { ...s, messages: [...s.messages, aiMessage] }
          : s
      ));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
      const systemMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: MessageRole.SYSTEM,
          text: `Error: ${errorMessage}`
      };
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId 
          ? { ...s, messages: [...s.messages, systemMessage] }
          : s
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <ChatHistory 
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex flex-col flex-1">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-grow overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {activeSession?.messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start my-6">
                <div className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg ml-12">
                  <Spinner />
                  <span className="text-gray-300">Mo_Bot is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>
        <div className="sticky bottom-0">
          {error && (
              <div className="bg-red-500/20 text-red-300 p-3 text-center text-sm border-t border-red-500/30">
                  {error}
              </div>
          )}
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;
