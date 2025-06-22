"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Send,
  Search,
  User,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  ArrowLeft,
} from "lucide-react";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: "text" | "image" | "file";
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantTitle: string;
  participantCompany: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  avatar: string;
  isOnline: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    participantId: "rec1",
    participantName: "Sarah Johnson",
    participantTitle: "Senior Recruiter",
    participantCompany: "TechCorp",
    lastMessage: "I'd like to discuss the Software Engineer position with you.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    unreadCount: 2,
    avatar: "SJ",
    isOnline: true,
  },
  {
    id: "2",
    participantId: "user2",
    participantName: "Mike Chen",
    participantTitle: "Full Stack Developer",
    participantCompany: "StartupXYZ",
    lastMessage: "Thanks for connecting! Looking forward to our conversation.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
    avatar: "MC",
    isOnline: false,
  },
  {
    id: "3",
    participantId: "rec2",
    participantName: "David Wilson",
    participantTitle: "Technical Recruiter",
    participantCompany: "Innovation Labs",
    lastMessage: "Your profile looks impressive. Let's schedule a call?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 1,
    avatar: "DW",
    isOnline: true,
  },
];

const mockMessages: { [conversationId: string]: ChatMessage[] } = {
  "1": [
    {
      id: "msg1",
      senderId: "rec1",
      senderName: "Sarah Johnson",
      content:
        "Hi! I came across your profile and I'm impressed with your experience in React and Node.js.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "text",
    },
    {
      id: "msg2",
      senderId: "current",
      senderName: "You",
      content:
        "Thank you! I'm always interested in new opportunities. Could you tell me more about the position?",
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      type: "text",
    },
    {
      id: "msg3",
      senderId: "rec1",
      senderName: "Sarah Johnson",
      content:
        "I'd like to discuss the Software Engineer position with you. We're looking for someone with your exact skill set. Are you available for a quick call this week?",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      type: "text",
    },
  ],
  "2": [
    {
      id: "msg4",
      senderId: "user2",
      senderName: "Mike Chen",
      content:
        "Hey! I saw we both work in the React ecosystem. Would love to connect and share experiences.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      type: "text",
    },
    {
      id: "msg5",
      senderId: "current",
      senderName: "You",
      content: "Absolutely! Always great to connect with fellow developers.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
      type: "text",
    },
    {
      id: "msg6",
      senderId: "user2",
      senderName: "Mike Chen",
      content: "Thanks for connecting! Looking forward to our conversation.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: "text",
    },
  ],
  "3": [
    {
      id: "msg7",
      senderId: "rec2",
      senderName: "David Wilson",
      content: "Your profile looks impressive. Let's schedule a call?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      type: "text",
    },
  ],
};

export default function ChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if not authorized
  useEffect(() => {
    if (
      !user ||
      (user.accountType !== "user" && user.accountType !== "recruiter")
    ) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages(mockMessages[conversation.id] || []);
    if (isMobileView) {
      setShowConversationList(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: ChatMessage = {
      id: `msg${Date.now()}`,
      senderId: "current",
      senderName: "You",
      content: newMessage.trim(),
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = mockConversations.filter(
    (conv) =>
      conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.participantCompany.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (
    !user ||
    (user.accountType !== "user" && user.accountType !== "recruiter")
  ) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-screen">
          {/* Conversations List */}
          <div
            className={`bg-gray-800 border-r border-gray-700 ${
              isMobileView
                ? showConversationList
                  ? "w-full"
                  : "hidden"
                : "w-1/3"
            }`}
          >
            {/* Back to Main Button */}
            <div className="p-4 border-b border-gray-700">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Main</span>
              </button>
            </div>

            {/* Header */}
            <div className="p-4 border-b border-gray-700">
              <h1 className="text-xl font-semibold text-white mb-4">
                Messages
              </h1>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="overflow-y-auto flex-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationSelect(conversation)}
                  className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? "bg-gray-700"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {conversation.avatar}
                      </div>
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium truncate">
                          {conversation.participantName}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {conversation.participantTitle} at{" "}
                        {conversation.participantCompany}
                      </p>
                      <p className="text-sm text-gray-300 truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                    </div>

                    {conversation.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div
            className={`flex-1 flex flex-col ${
              isMobileView && showConversationList ? "hidden" : ""
            }`}
          >
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="bg-gray-800 border-b border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Back Button - Only visible on mobile devices */}
                      {isMobileView && (
                        <button
                          onClick={() => setShowConversationList(true)}
                          className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700 flex items-center justify-center"
                          title="Back to conversations"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                      )}
                      <div className="relative">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {selectedConversation.avatar}
                        </div>
                        {selectedConversation.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-white font-medium">
                          {selectedConversation.participantName}
                        </h2>
                        <p className="text-sm text-gray-400">
                          {selectedConversation.participantTitle} at{" "}
                          {selectedConversation.participantCompany}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === "current"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === "current"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-100"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.senderId === "current"
                              ? "text-blue-100"
                              : "text-gray-400"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="bg-gray-800 border-t border-gray-700 p-4">
                  <div className="flex items-end space-x-2">
                    <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700">
                      <Paperclip className="w-5 h-5" />
                    </button>

                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700">
                      <Smile className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* No conversation selected */
              <div className="flex-1 flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No conversation selected
                  </h3>
                  <p className="text-gray-400">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
