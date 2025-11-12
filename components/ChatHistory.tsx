import React from 'react';
import { ChatSession } from '../types';
import { PlusIcon, ChatBubbleLeftIcon, TrashIcon, CloseIcon } from './icons';

interface ChatHistoryProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  isOpen,
  setIsOpen,
}) => {
  return (
    <>
        <aside className={`absolute lg:relative z-30 flex-col h-full w-64 bg-gray-800 border-r border-gray-700 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:flex`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold">Chat History</h2>
                <button onClick={onNewSession} className="text-gray-400 hover:text-white">
                    <PlusIcon className="w-6 h-6" />
                </button>
                <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-2 sidebar-scrollbar">
                <ul>
                    {sessions.map((session) => (
                    <li key={session.id} className="my-1">
                        <button
                        onClick={() => onSelectSession(session.id)}
                        className={`w-full flex items-center gap-3 text-left p-2 rounded-md transition-colors group ${
                            activeSessionId === session.id ? 'bg-blue-600/30 text-white' : 'hover:bg-gray-700/50 text-gray-300'
                        }`}
                        >
                        <ChatBubbleLeftIcon className="w-5 h-5 flex-shrink-0" />
                        <span className="flex-1 truncate text-sm">{session.title}</span>
                         <span
                            onClick={(e) => {
                                e.stopPropagation();
                                if(window.confirm("Are you sure you want to delete this chat?")) {
                                    onDeleteSession(session.id);
                                }
                            }}
                            className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                            <TrashIcon className="w-4 h-4" />
                         </span>
                        </button>
                    </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-700 text-center text-xs text-gray-500">
                Created By Reza
            </div>
        </aside>
        {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 z-20 lg:hidden"></div>}
    </>
  );
};

export default ChatHistory;
