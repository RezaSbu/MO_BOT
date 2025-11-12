import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { PaperClipIcon, SendIcon, Spinner, CloseIcon, MicrophoneIcon } from './icons';

interface ChatInputProps {
  onSendMessage: (text: string, file: File | null, useWebSearch: boolean) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      }
    }
  }, []);

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        alert("Please select an image file.");
      }
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || (!text.trim() && !file)) return;
    onSendMessage(text, file, useWebSearch);
    setText('');
    handleRemoveFile();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const hasSpeechRecognition = !!recognitionRef.current;

  return (
    <div className="bg-gray-800 p-4 border-t border-gray-700">
        {filePreview && (
            <div className="mb-4 relative w-28 h-28 group">
                <img src={filePreview} alt="Preview" className="w-full h-full object-cover rounded-lg"/>
                <button
                    onClick={handleRemoveFile}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                >
                    <CloseIcon className="w-4 h-4" />
                </button>
            </div>
        )}
      <form onSubmit={handleSubmit} className="flex items-start gap-4">
        <label htmlFor="file-upload" className="cursor-pointer text-gray-400 hover:text-white pt-3">
          <PaperClipIcon className="w-6 h-6" />
        </label>
        <input
          id="file-upload"
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
          disabled={isLoading}
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something or upload an image..."
          className="flex-grow bg-gray-700 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={1}
          disabled={isLoading}
          style={{ maxHeight: '150px' }}
        />
        {hasSpeechRecognition && (
          <button
            type="button"
            onClick={handleMicClick}
            className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-600 text-white animate-pulse' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
            disabled={isLoading}
            aria-label="Use microphone"
          >
            <MicrophoneIcon className="w-6 h-6" />
          </button>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          disabled={isLoading || (!text.trim() && !file)}
        >
          {isLoading ? <Spinner /> : <SendIcon className="w-6 h-6" />}
        </button>
      </form>
       <div className="flex items-center mt-3 ml-12">
            <label htmlFor="web-search-toggle" className="flex items-center cursor-pointer">
                <div className="relative">
                    <input type="checkbox" id="web-search-toggle" className="sr-only" checked={useWebSearch} onChange={() => setUseWebSearch(!useWebSearch)} />
                    <div className={`block w-10 h-6 rounded-full ${useWebSearch ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${useWebSearch ? 'translate-x-full' : ''}`}></div>
                </div>
                <div className="ml-3 text-gray-400 text-sm">Web Search</div>
            </label>
        </div>
    </div>
  );
};

export default ChatInput;