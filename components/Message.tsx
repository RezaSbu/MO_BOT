import React, { useState } from 'react';
import { ChatMessage, MessageRole } from '../types';
import { UserIcon, SparklesIcon, ClipboardIcon, CheckIcon } from './icons';

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`flex items-start gap-4 my-6`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <SparklesIcon className="w-5 h-5 text-white" />
        </div>
      )}
       {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 ml-auto">
          <UserIcon className="w-5 h-5 text-gray-300" />
        </div>
      )}
      <div className={`max-w-2xl w-full flex flex-col group ${isUser ? 'items-start order-first' : 'items-start'}`}>
        <div className={`rounded-2xl p-4 relative ${isUser ? 'bg-blue-600 rounded-bl-none ml-auto' : 'bg-gray-700 rounded-br-none'}`}>
          {message.image && (
            <div className="mb-3">
              <img src={message.image.url} alt={message.image.name} className="max-w-xs max-h-64 rounded-lg" />
            </div>
          )}
          <p className="text-white whitespace-pre-wrap">{message.text}</p>
          {!isUser && (
            <button 
                onClick={handleCopy}
                className="absolute -bottom-3 -right-3 p-1.5 bg-gray-600 rounded-full text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-500"
                aria-label="Copy message"
            >
                {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
            </button>
          )}
        </div>
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-3 text-sm text-gray-400">
            <h4 className="font-semibold mb-1">Sources:</h4>
            <ul className="list-disc list-inside space-y-1">
              {message.sources.map((source, index) => (
                <li key={index}>
                  <a
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                    title={source.title}
                  >
                    {source.title || new URL(source.uri).hostname}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;