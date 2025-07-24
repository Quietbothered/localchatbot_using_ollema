// frontend/app/components/ChatWindow.js
'use client';

import { useRef, useEffect } from 'react';
import Message from './Message';

export default function ChatWindow({ messages, isStreaming, onSendMessage, onStop, input, setInput, activeChatId }) {
  const messagesEndRef = useRef(null);

  // Effect to auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || !activeChatId || isStreaming) return;
    onSendMessage(input);
  };

  return (
    <div className="w-3/4 flex flex-col bg-gray-50">
      {/* Message Display Area */}
      <div className="flex-grow p-6 overflow-y-auto">
        {activeChatId ? (
          messages.map((msg, index) => (
            <Message key={index} role={msg.role} content={msg.content} />
          ))
        ) : (
          <div className="text-center text-gray-500 mt-20">
            <h2 className="text-2xl font-semibold">Cointab Chat</h2>
            <p>Select a chat from the sidebar or start a new one.</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-200">
        {isStreaming && (
          <button
            onClick={onStop}
            className="mx-auto mb-3 flex items-center justify-center gap-2 bg-red-500 text-white rounded-lg py-2 px-4 hover:bg-red-600 transition"
          >
            ■ Stop Generating
          </button>
        )}
        <form onSubmit={handleFormSubmit} className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            disabled={!activeChatId || isStreaming}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg px-6 py-3 hover:bg-blue-600 transition disabled:bg-gray-400"
            disabled={!activeChatId || isStreaming}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
