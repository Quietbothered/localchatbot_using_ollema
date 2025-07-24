// // // frontend/app/page.js
// // 'use client';

// // import { useState, useEffect } from 'react';
// // import Sidebar from './components/Sidebar';
// // import ChatWindow from './components/ChatWindow';

// // export default function Home() {
// //   // State Management
// //   const [chats, setChats] = useState([]); // List of all chat sessions
// //   const [activeChatId, setActiveChatId] = useState(null); // The currently selected chat
// //   const [messages, setMessages] = useState([]); // Messages for the active chat
// //   const [input, setInput] = useState(''); // The user's current input
// //   const [isStreaming, setIsStreaming] = useState(false); // Flag for when the AI is responding

// //   const API_URL = 'http://localhost:3001'; // Your backend URL

// //   // --- Data Fetching Effects ---

// //   // Fetch all chat sessions on initial load
// //   useEffect(() => {
// //     const fetchChats = async () => {
// //       try {
// //         const res = await fetch(`${API_URL}/api/chats`);
// //         const data = await res.json();
// //         setChats(data);
// //       } catch (error) {
// //         console.error("Failed to fetch chats:", error);
// //       }
// //     };
// //     fetchChats();
// //   }, []);

// //   // Fetch messages whenever the active chat changes
// //   useEffect(() => {
// //     if (activeChatId) {
// //       const fetchMessages = async () => {
// //         try {
// //           const res = await fetch(`${API_URL}/api/chat/${activeChatId}`);
// //           const data = await res.json();
// //           setMessages(data);
// //         } catch (error) {
// //           console.error("Failed to fetch messages:", error);
// //         }
// //       };
// //       fetchMessages();
// //     } else {
// //       setMessages([]); // Clear messages if no chat is active
// //     }
// //   }, [activeChatId]);

// //   // --- Event Handlers ---

// //   const handleNewChat = async () => {
// //     try {
// //       const res = await fetch(`${API_URL}/api/chat`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ title: 'New Conversation' }), // You can enhance this later
// //       });
// //       const newChat = await res.json();
// //       setChats([newChat, ...chats]); // Add new chat to the top of the list
// //       setActiveChatId(newChat.id); // Set it as the active chat
// //     } catch (error) {
// //       console.error("Failed to create new chat:", error);
// //     }
// //   };

// //   const handleSendMessage = async (messageContent) => {
// //     // Optimistically update UI with user's message
// //     const userMessage = { role: 'user', content: messageContent };
// //     setMessages((prev) => [...prev, userMessage]);
// //     setInput('');
// //     setIsStreaming(true);

// //     try {
// //       const res = await fetch(`${API_URL}/api/chat/${activeChatId}/message`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ message: messageContent }),
// //       });

// //       if (!res.ok || !res.body) {
// //         throw new Error('Failed to get streaming response.');
// //       }

// //       const reader = res.body.getReader();
// //       const decoder = new TextDecoder();

// //       // Add a placeholder for the assistant's message
// //       setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

// //       // Process the stream
// //       while (true) {
// //         const { value, done } = await reader.read();
// //         if (done) break;
// //         const chunk = decoder.decode(value, { stream: true });
// //         // Update the last message (the assistant's) with the new chunk
// //         setMessages((prev) =>
// //           prev.map((msg, index) =>
// //             index === prev.length - 1 ? { ...msg, content: msg.content + chunk } : msg
// //           )
// //         );
// //       }
// //     } catch (error) {
// //       console.error("Error sending message:", error);
// //       // Optionally, add an error message to the chat
// //     } finally {
// //       setIsStreaming(false);
// //     }
// //   };

// //   const handleStopStreaming = async () => {
// //     if (!activeChatId) return;
// //     try {
// //       await fetch(`${API_URL}/api/chat/${activeChatId}/stop`, { method: 'POST' });
// //     } catch (error) {
// //       console.error("Failed to stop stream:", error);
// //     } finally {
// //       setIsStreaming(false);
// //     }
// //   };

// //   // --- Render Method ---
// //   return (
// //     <div className="flex h-screen bg-gray-100 font-sans">
// //       <Sidebar
// //         chats={chats}
// //         activeChatId={activeChatId}
// //         onNewChat={handleNewChat}
// //         onSelectChat={setActiveChatId}
// //       />
// //       <ChatWindow
// //         messages={messages}
// //         isStreaming={isStreaming}
// //         onSendMessage={handleSendMessage}
// //         onStop={handleStopStreaming}
// //         input={input}
// //         setInput={setInput}
// //         activeChatId={activeChatId}
// //       />
// //     </div>
// //   );
// // }

// // frontend/app/page.js
// 'use client';

// import { useState, useEffect } from 'react';
// import Sidebar from './components/Sidebar';
// import ChatWindow from './components/ChatWindow';

// export default function Home() {
//   // State Management
//   const [chats, setChats] = useState([]); // List of all chat sessions
//   const [activeChatId, setActiveChatId] = useState(null); // The currently selected chat
//   const [messages, setMessages] = useState([]); // Messages for the active chat
//   const [input, setInput] = useState(''); // The user's current input
//   const [isStreaming, setIsStreaming] = useState(false); // Flag for when the AI is responding

//   const API_URL = 'http://localhost:3001'; // Your backend URL

//   // --- Data Fetching Effects ---

//   // Fetch all chat sessions on initial load
//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const res = await fetch(`${API_URL}/api/chats`);
//         const data = await res.json();
//         setChats(data);
//       } catch (error) {
//         console.error("Failed to fetch chats:", error);
//       }
//     };
//     fetchChats();
//   }, []);

//   // Fetch messages whenever the active chat changes
//   useEffect(() => {
//     if (activeChatId) {
//       const fetchMessages = async () => {
//         try {
//           const res = await fetch(`${API_URL}/api/chat/${activeChatId}`);
//           const data = await res.json();
//           setMessages(data);
//         } catch (error) {
//           console.error("Failed to fetch messages:", error);
//         }
//       };
//       fetchMessages();
//     } else {
//       setMessages([]); // Clear messages if no chat is active
//     }
//   }, [activeChatId]);

//   // --- Event Handlers ---

//   const handleNewChat = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/chat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ title: 'New Conversation' }),
//       });
//       const newChat = await res.json();
//       setChats([newChat, ...chats]);
//       setActiveChatId(newChat.id);
//     } catch (error) {
//       console.error("Failed to create new chat:", error);
//     }
//   };

//   const handleSendMessage = async (messageContent) => {
//     const userMessage = { role: 'user', content: messageContent };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput('');
//     setIsStreaming(true);

//     try {
//       const res = await fetch(`${API_URL}/api/chat/${activeChatId}/message`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: messageContent }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.details || 'Failed to get streaming response.');
//       }

//       if (!res.body) {
//         throw new Error('Response body is missing.');
//       }

//       const reader = res.body.getReader();
//       const decoder = new TextDecoder();

//       setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;
//         const chunk = decoder.decode(value, { stream: true });
//         setMessages((prev) =>
//           prev.map((msg, index) =>
//             index === prev.length - 1 ? { ...msg, content: msg.content + chunk } : msg
//           )
//         );
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//       // Display the specific error in the chat window
//       const errorMessage = { role: 'assistant', content: `Error: ${error.message}` };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsStreaming(false);
//     }
//   };

//   const handleStopStreaming = async () => {
//     if (!activeChatId) return;
//     try {
//       await fetch(`${API_URL}/api/chat/${activeChatId}/stop`, { method: 'POST' });
//     } catch (error) {
//       console.error("Failed to stop stream:", error);
//     } finally {
//       setIsStreaming(false);
//     }
//   };

//   // --- Render Method ---
//   return (
//     <div className="flex h-screen bg-gray-100 font-sans">
//       <Sidebar
//         chats={chats}
//         activeChatId={activeChatId}
//         onNewChat={handleNewChat}
//         onSelectChat={setActiveChatId}
//       />
//       <ChatWindow
//         messages={messages}
//         isStreaming={isStreaming}
//         onSendMessage={handleSendMessage}
//         onStop={handleStopStreaming}
//         input={input}
//         setInput={setInput}
//         activeChatId={activeChatId}
//       />
//     </div>
//   );
// }


// frontend/app/page.js
'use client';

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

export default function Home() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const API_URL = 'http://localhost:3001';

  // --- Data Fetching ---
  const fetchChats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chats`);
      const data = await res.json();
      setChats(data);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (activeChatId) {
      const fetchMessages = async () => {
        try {
          const res = await fetch(`${API_URL}/api/chat/${activeChatId}`);
          const data = await res.json();
          setMessages(data);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
          setMessages([]);
        }
      };
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [activeChatId]);

  // --- Event Handlers ---

  const handleNewChat = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Conversation' }),
      });
      const newChat = await res.json();
      setChats([newChat, ...chats]);
      setActiveChatId(newChat.id);
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };

  const handleSendMessage = async (messageContent) => {
    if (!activeChatId) return;
    
    // Check if this is the first message to generate a title
    const isFirstMessage = messages.length === 0;

    const userMessage = { role: 'user', content: messageContent };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    // --- Title Generation Logic ---
    if (isFirstMessage) {
      // Asynchronously update the title
      (async () => {
        try {
          const res = await fetch(`${API_URL}/api/chat/${activeChatId}/title`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: messageContent }),
          });
          const updatedChat = await res.json();
          // Update the title in the sidebar list
          setChats(prevChats =>
            prevChats.map(chat =>
              chat.id === activeChatId ? { ...chat, title: updatedChat.title } : chat
            )
          );
        } catch (error) {
          console.error('Failed to generate title:', error);
          // Don't block chat for this, it can fail silently or be retried
        }
      })();
    }
    
    // --- Stream Message Response ---
    try {
      const res = await fetch(`${API_URL}/api/chat/${activeChatId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageContent }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || 'Failed to get streaming response.');
      }
      if (!res.body) throw new Error('Response body is missing.');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((msg, index) =>
            index === prev.length - 1 ? { ...msg, content: msg.content + chunk } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = { role: 'assistant', content: `Error: ${error.message}` };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleDeleteChat = async (chatIdToDelete) => {
    // Optimistically update UI
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatIdToDelete));
    if (activeChatId === chatIdToDelete) {
      setActiveChatId(null);
    }

    try {
      const res = await fetch(`${API_URL}/api/chat/${chatIdToDelete}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Server failed to delete chat');
    } catch (error) {
      console.error("Error deleting chat:", error);
      // Re-fetch to sync with server state if deletion fails
      fetchChats();
    }
  };
  
  const handleStopStreaming = async () => {
    // This function remains the same
    if (!activeChatId) return;
    try {
      await fetch(`${API_URL}/api/chat/${activeChatId}/stop`, { method: 'POST' });
    } catch (error) {
      console.error("Failed to stop stream:", error);
    } finally {
      setIsStreaming(false);
    }
  };

  // --- Render Method ---
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={setActiveChatId}
        onDeleteChat={handleDeleteChat} // Pass the new handler
      />
      <ChatWindow
        messages={messages}
        isStreaming={isStreaming}
        onSendMessage={handleSendMessage}
        onStop={handleStopStreaming}
        input={input}
        setInput={setInput}
        activeChatId={activeChatId}
      />
    </div>
  );
}