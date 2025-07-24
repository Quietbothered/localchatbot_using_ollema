// // frontend/app/components/Sidebar.js
// 'use client';

// export default function Sidebar({ chats, activeChatId, onNewChat, onSelectChat }) {
//   return (
//     <div className="w-1/4 bg-white border-r border-gray-200 p-4 flex flex-col">
//       <button
//         onClick={onNewChat}
//         className="w-full bg-blue-500 text-white rounded-lg py-2 mb-4 hover:bg-blue-600 transition-colors duration-200"
//       >
//         + New Chat
//       </button>
//       <div className="flex-grow overflow-y-auto">
//         <h2 className="text-sm font-semibold text-gray-500 mb-2">Chat History</h2>
//         {chats.map((chat) => (
//           <div
//             key={chat.id}
//             onClick={() => onSelectChat(chat.id)}
//             className={`p-2 my-1 rounded-lg cursor-pointer text-sm truncate ${
//               activeChatId === chat.id
//                 ? 'bg-blue-100 text-blue-800'
//                 : 'hover:bg-gray-100'
//             }`}
//           >
//             {chat.title}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// frontend/app/components/Sidebar.js
'use client';

// A simple trash icon component
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default function Sidebar({ chats, activeChatId, onNewChat, onSelectChat, onDeleteChat }) {
  return (
    <div className="w-1/4 bg-white border-r border-gray-200 p-4 flex flex-col">
      <button
        onClick={onNewChat}
        className="w-full bg-blue-500 text-white rounded-lg py-2 mb-4 hover:bg-blue-600 transition-colors duration-200"
      >
        + New Chat
      </button>
      <div className="flex-grow overflow-y-auto">
        <h2 className="text-sm font-semibold text-gray-500 mb-2 px-2">Chat History</h2>
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`group flex items-center justify-between p-2 my-1 rounded-lg cursor-pointer text-sm ${
              activeChatId === chat.id
                ? 'bg-blue-100 text-blue-800'
                : 'hover:bg-gray-100'
            }`}
          >
            <span className="truncate">{chat.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents selecting the chat
                if (window.confirm('Are you sure you want to delete this chat?')) {
                  onDeleteChat(chat.id);
                }
              }}
              // Hide button by default, show on hover of the parent group
              className="text-gray-400 hover:text-red-500 ml-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Delete chat"
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}