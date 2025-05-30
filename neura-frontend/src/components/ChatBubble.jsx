export default function ChatBubble({ sender, text, onDelete, messageId }) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div
        className={`relative max-w-xs sm:max-w-md px-4 py-2 rounded-2xl text-sm shadow-md leading-relaxed ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        {text}

        {/* Tombol hapus */}
        {isUser && (
          <button
            onClick={() => onDelete(messageId)}
            className="absolute top-0 right-0 mt-[-10px] mr-[-10px] text-xs text-gray-500 opacity-0 group-hover:opacity-100 hover:text-red-500 transition"
            title="Hapus pesan"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}
