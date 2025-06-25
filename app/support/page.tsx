"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { FiSend, FiPlusCircle, FiBell, FiArrowLeft, FiChevronDown, FiChevronUp, FiSearch, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "animate.css";

type Chat = {
  _id: string;
  participants: string[];
  messages: Message[];
  updatedAt: string;
  unreadCount?: number;
  status?: "active" | "resolved";
};

type Message = {
  _id: string;
  senderId?: string | null;
  senderType: "user" | "support" | "bot";
  text: string;
  timestamp: string;
  fileUrl?: string | null;
  fileType?: string;
};

type UserProfile = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isVerified: boolean;
  assignedProperties: string[];
  availability: boolean;
  onboardingChecklist: boolean;
  tasks: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export default function SupportPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const userId = user?._id;

  const [threads, setThreads] = useState<Chat[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showNewMessagePop, setShowNewMessagePop] = useState<string | null>(null);
  const [ticketMessage, setTicketMessage] = useState("");
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeExpanded, setActiveExpanded] = useState(true);
  const [resolvedExpanded, setResolvedExpanded] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Chat[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [senderProfiles, setSenderProfiles] = useState<{ [key: string]: { fullName: string; role: string } }>({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!token || !userId) {
          router.push("/property-manager/login");
          return;
        }

        const response = await fetch(
          `https://limpiar-backend.onrender.com/api/users/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch user profile");
        }

        setUserProfile(result);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Error fetching user profile.");
      }
    };

    fetchUserProfile();
  }, [token, userId, router]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (!token || !userId) {
          console.warn("Missing token or userId:", { token, userId });
          router.push("/partner/login");
          return;
        }

        const response = await fetch(
          `https://limpiar-backend.onrender.com/api/chats/threads/user/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch support chats");
        }

        const chats = Array.isArray(result) ? result : result.data || [];
        if (!Array.isArray(chats)) {
          console.error("Expected chats to be an array, got:", result);
          setThreads([]);
          setFilteredThreads([]);
          setUnreadTotal(0);
          return;
        }

        const sortedThreads = chats
          .map((chat: Chat) => {
            const unreadCount =
              chat.messages?.filter(
                (msg: Message) =>
                  msg.senderType !== "user" &&
                  new Date(msg.timestamp) > new Date(chat.updatedAt)
              ).length || 0;

            return {
              ...chat,
              unreadCount,
              status: chat.resolved ? "resolved" : "active",
            };
          })
          .sort(
            (a: Chat, b: Chat) =>
              new Date(b.updatedAt).getTime() -
              new Date(a.updatedAt).getTime()
          );

        setThreads(sortedThreads);
        setFilteredThreads(sortedThreads);
        setUnreadTotal(
          sortedThreads.reduce(
            (sum: number, chat: Chat) => sum + (chat.unreadCount || 0),
            0
          )
        );
      } catch (error: any) {
        console.error("Error fetching threads:", error);
        setError(error.message || "Error fetching threads.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
    const intervalId = setInterval(fetchChats, 5000); // Refresh every 5s
    return () => clearInterval(intervalId);
  }, [router, token, userId]); 

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setFilteredThreads(threads);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const results = threads.filter((chat) => {
      const titleMatch = (chat.messages[0]?.text || "New Thread")
        .toLowerCase()
        .includes(lowerCaseQuery);
      const messageMatch = chat.messages.some((msg) =>
        msg.text.toLowerCase().includes(lowerCaseQuery)
      );
      const dateMatch = new Date(chat.updatedAt)
        .toLocaleDateString()
        .toLowerCase()
        .includes(lowerCaseQuery);

      return titleMatch || messageMatch || dateMatch;
    });

    setSearchResults(results);
    setFilteredThreads(results);
  }, [searchQuery, threads]);

  const handleCreateTicket = async () => {
    if (!userId || !token || !ticketMessage.trim()) return;

    setCreatingTicket(true);
    try {
      const response = await fetch(
        "https://limpiar-backend.onrender.com/api/chats/support/start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            messageText: ticketMessage,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to start new ticket");
      }

      setThreads((prevThreads) => [
        {
          _id: result._id,
          participants: result.participants,
          messages: [],
          updatedAt: result.updatedAt,
          unreadCount: 0,
          status: "active",
        },
        ...prevThreads,
      ]);

      setSelectedChatId(result._id);
      setMessages([]);
      setTicketMessage("");
      setShowForm(false);
    } catch (error: any) {
      setError(error.message || "Error starting a new ticket");
      console.error("Error starting new ticket:", error);
    } finally {
      setCreatingTicket(false);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChatId) return;

      try {
        if (!token) {
          router.push("/property-manager/login");
          return;
        }

        const response = await fetch(
          `https://limpiar-backend.onrender.com/api/chats/support/messages/${selectedChatId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch messages");
        }

        setMessages(result.data.messages || []);
        setThreads((prevThreads) =>
          prevThreads.map((chat) =>
            chat._id === selectedChatId ? { ...chat, unreadCount: 0 } : chat
          )
        );
        setUnreadTotal(
          threads
            .filter((chat) => chat._id !== selectedChatId)
            .reduce(
              (sum: number, chat: Chat) => sum + (chat.unreadCount || 0),
              0
            )
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    const messageIntervalId = setInterval(fetchMessages, 5000);
    return () => clearInterval(messageIntervalId);
  }, [selectedChatId, router, token]);

  // Fetch sender profiles for messages with senderType: "user" and senderId !== userId
  useEffect(() => {
    const fetchSenderProfiles = async () => {
      const uniqueSenderIds = [...new Set(messages
        .filter(msg => msg.senderType === "user" && msg.senderId && msg.senderId !== userId)
        .map(msg => msg.senderId as string))];

      for (const senderId of uniqueSenderIds) {
        if (!senderProfiles[senderId]) {
          try {
            const response = await fetch(
              `https://limpiar-backend.onrender.com/api/users/${senderId}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const result = await response.json();

            if (!response.ok) {
              throw new Error(result.error || `Failed to fetch profile for user ${senderId}`);
            }

            setSenderProfiles(prev => ({
              ...prev,
              [senderId]: {
                fullName: result.fullName || "Unknown",
                role: result.role || "user",
              },
            }));
          } catch (error) {
            console.error(`Error fetching profile for user ${senderId}:`, error);
            setSenderProfiles(prev => ({
              ...prev,
              [senderId]: {
                fullName: "Unknown",
                role: "user",
              },
            }));
          }
        }
      }
    };

    if (messages.length > 0 && token) {
      fetchSenderProfiles();
    }
  }, [messages, token, userId, senderProfiles]);

  const handleReply = async () => {
    if (!newMessage.trim() || !selectedChatId || !token) return;

    try {
      const newSentMessage: Message = {
        _id: Date.now().toString(),
        text: newMessage,
        timestamp: new Date().toISOString(),
        senderType: "user",
        senderId: userId,
      };

      setMessages((prevMessages) => [...prevMessages, newSentMessage]);
      setNewMessage("");
      setIsTyping(true);

      setTimeout(async () => {
        setIsTyping(false);

        const response = await fetch(
          "https://limpiar-backend.onrender.com/api/chats/support/reply",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              chatId: selectedChatId,
              message: newMessage,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to send reply");
        }

        if (result.messages && Array.isArray(result.messages)) {
          const latestMessage = result.messages[result.messages.length - 1];
          if (latestMessage.senderType !== "user") {
            setShowNewMessagePop(selectedChatId);
            setTimeout(() => setShowNewMessagePop(null), 3000);
          }
        } else {
          throw new Error("Failed to send reply: Missing messages array");
        }
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Error sending reply");
      console.error("Error sending reply:", error);
    }
  };

  const handlePopupClick = (chatId: string) => {
    setSelectedChatId(chatId);
    setShowNewMessagePop(null);
    setThreads((prevThreads) =>
      prevThreads.map((chat) =>
        chat._id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    );
    setUnreadTotal(
      threads
        .filter((chat) => chat._id !== chatId)
        .reduce((sum: number, chat: Chat) => sum + (chat.unreadCount || 0), 0)
    );
  };

  const handleSearchResultClick = (chatId: string) => {
    setSelectedChatId(chatId);
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
    setFilteredThreads(threads);
  };

  const handleLogout = () => {
    dispatch({ type: "auth/logout" });
    router.push("/property-manager/login");
  };

  const activeThreads = filteredThreads.filter((chat) => chat.status === "active");
  const resolvedThreads = filteredThreads.filter((chat) => chat.status === "resolved");

  const userFirstNameInitial = userProfile?.fullName?.split(" ")[0]?.charAt(0)?.toUpperCase() || "U";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-800 to-blue-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-t-transparent border-white rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-screen bg-gradient-to-br from-gray-800 via-blue-900 to-blue-600 overflow-hidden">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      {/* Topbar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white to-blue-50 shadow-lg p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-600 hover:text-blue-600 transition-all"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <FiArrowLeft className="w-6 h-6" />
          </motion.button>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent drop-shadow-md tracking-tight">
            Limpiar HelpDesk
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-600 hover:text-blue-600 transition-all"
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Toggle search"
          >
            <FiSearch className="w-6 h-6" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative text-gray-600 hover:text-blue-600 transition-all"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Toggle notifications"
          >
            <FiBell className="w-6 h-6" />
            {unreadTotal > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadTotal}
              </span>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-600 hover:text-blue-600 transition-all relative"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            aria-label="User profile"
          >
            <FiUser className="w-6 h-6" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-full shadow-md flex items-center gap-2 hover:from-blue-700 hover:to-blue-900 transition-all"
            onClick={() => setShowForm(true)}
          >
            <FiPlusCircle className="w-5 h-5" />
            {creatingTicket ? "Creating..." : "Add New Ticket"}
          </motion.button>
        </div>
      </motion.div>

      {/* User Profile Dropdown */}
      <AnimatePresence>
        {showProfileDropdown && userProfile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 right-20 bg-white rounded-lg shadow-xl w-64 z-50 border border-gray-100"
          >
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                {userProfile.fullName}
              </h3>
              <p className="text-sm text-gray-600">{userProfile.email}</p>
              <p className="text-sm text-blue-600 capitalize mt-1">
                {userProfile.role.replace("_", " ")}
              </p>
            </div>
            <div className="p-4">
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-full hover:from-blue-700 hover:to-blue-900 transition-all"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Input and Results */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-5 right-5 bg-white rounded-lg shadow-xl z-50"
          >
            <div className="p-4">
              <input
                type="text"
                placeholder="Search threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-0 bg-gray-100 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="max-h-64 overflow-y-auto border-t">
                {searchResults.map((chat) => (
                  <motion.div
                    key={chat._id}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    onClick={() => handleSearchResultClick(chat._id)}
                    className="p-4 cursor-pointer border-b"
                  >
                    <p className="text-gray-800 font-medium text-sm truncate">
                      {chat.messages[0]?.text || "New Thread"}
                    </p>
                    <p className="text-xs text-gray-600 truncate mt-1">
                      {chat.messages.find((msg) =>
                        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
                      )?.text || "Matching content..."}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
            {searchQuery && searchResults.length === 0 && (
              <p className="p-4 text-gray-500 text-sm">No matching threads found.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 right-5 bg-white rounded-lg shadow-xl w-80 max-h-96 overflow-y-auto z-50 border border-gray-100"
          >
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Notifications
              </h3>
            </div>
            {threads.some((chat) => (chat.unreadCount || 0) > 0) ? (
              threads
                .filter((chat) => (chat.unreadCount || 0) > 0)
                .map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => {
                      setSelectedChatId(chat._id);
                      setShowNotifications(false);
                      setThreads((prevThreads) =>
                        prevThreads.map((c) =>
                          c._id === chat._id ? { ...c, unreadCount: 0 } : c
                        )
                      );
                      setUnreadTotal(
                        threads
                          .filter((c) => c._id !== chat._id)
                          .reduce(
                            (sum: number, c: Chat) =>
                              sum + (c.unreadCount || 0),
                            0
                          )
                      );
                    }}
                    className="p-4 hover:bg-gray-100 cursor-pointer border-b"
                  >
                    <p className="text-sm text-gray-800 font-medium">
                      New messages in thread
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {chat.messages[chat.messages.length - 1]?.text ||
                        "No message yet"}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {chat.unreadCount} unread
                    </p>
                  </div>
                ))
            ) : (
              <p className="p-4 text-gray-500 text-sm">No new notifications</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Ticket Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl z-50 w-full max-w-md border border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Create a New Ticket
            </h3>
            <textarea
              className="w-full h-36 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
              placeholder="Describe your issue..."
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
            />
            <div className="flex justify-end mt-4 gap-3">
              <button
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-300 transition-all"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-blue-900 transition-all"
                onClick={handleCreateTicket}
                disabled={creatingTicket || !ticketMessage.trim()}
              >
                {creatingTicket ? "Creating..." : "Create Ticket"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 mt-16 overflow-hidden">
        {/* Sidebar: Threads List with Categories */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`${
            isMobileView && selectedChatId ? "hidden" : "w-1/3 md:w-1/3"
          } bg-white rounded-l-2xl shadow-2xl overflow-y-auto transition-all`}
        >
          {/* Active Threads */}
          <div className="border-b">
            <motion.div
              onClick={() => setActiveExpanded(!activeExpanded)}
              className="p-4 flex items-center justify-between cursor-pointer bg-blue-50"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                Active ({activeThreads.length})
              </h3>
              {activeExpanded ? (
                <FiChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <FiChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </motion.div>
            <AnimatePresence>
              {activeExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeThreads.length > 0 ? (
                    activeThreads.map((chat) => (
                      <motion.div
                        key={chat._id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedChatId(chat._id)}
                        className={`cursor-pointer p-6 border-b transition-all duration-300 hover:shadow-md ${
                          selectedChatId === chat._id ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <p
                            className={`text-gray-800 truncate ${
                              chat.unreadCount ? "font-bold" : "font-medium"
                            } text-lg`}
                          >
                            {chat.messages[0]?.text || "New Thread"}
                          </p>
                          {chat.unreadCount ? (
                            <span className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-xs rounded-full px-2 py-1">
                              {chat.unreadCount}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-2">
                          {chat.messages[chat.messages.length - 1]?.text ||
                            "No message yet"}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(chat.updatedAt).toLocaleDateString()}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="p-6 text-gray-500">No active threads.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Resolved Threads */}
          <div>
            <motion.div
              onClick={() => setResolvedExpanded(!resolvedExpanded)}
              className="p-4 flex items-center justify-between cursor-pointer bg-blue-50"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                Resolved ({resolvedThreads.length})
              </h3>
              {resolvedExpanded ? (
                <FiChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <FiChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </motion.div>
            <AnimatePresence>
              {resolvedExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {resolvedThreads.length > 0 ? (
                    resolvedThreads.map((chat) => (
                      <motion.div
                        key={chat._id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedChatId(chat._id)}
                        className={`cursor-pointer p-6 border-b transition-all duration-300 hover:shadow-md ${
                          selectedChatId === chat._id ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <p
                            className={`text-gray-800 truncate ${
                              chat.unreadCount ? "font-bold" : "font-medium"
                            } text-lg`}
                          >
                            {chat.messages[0]?.text || "New Thread"}
                          </p>
                          {chat.unreadCount ? (
                            <span className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-xs rounded-full px-2 py-1">
                              {chat.unreadCount}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-2">
                          {chat.messages[chat.messages.length - 1]?.text ||
                            "No message yet"}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(chat.updatedAt).toLocaleDateString()}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="p-6 text-gray-500">No resolved threads.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Chat Area */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`${
            isMobileView && selectedChatId ? "w-full" : "flex-1 md:flex-1"
          } flex flex-col bg-white rounded-r-2xl shadow-2xl transition-all`}
        >
          {selectedChatId ? (
            <>
              {/* Chat Header with Back Button */}
              <div className="p-4 border-b flex items-center gap-3 bg-blue-50">
                {isMobileView && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedChatId(null)}
                    className="text-gray-600 hover:text-blue-600 transition-all"
                    aria-label="Go back"
                  >
                    <FiArrowLeft className="w-6 h-6" />
                  </motion.button>
                )}
                <h3 className="text-lg font-semibold text-gray-800">
                  {threads.find((chat) => chat._id === selectedChatId)?.messages[0]?.text || "New Thread"}
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {messages.map((msg, index) => {
                  // Determine if the message is from the current user
                  const isCurrentUserMessage = msg.senderId === userId;

                  // For messages with senderType: "user" and not from the current user, check if the sender is an admin
                  let isSenderAdmin = false;
                  let senderInitial = "U";
                  if (msg.senderType === "user" && !isCurrentUserMessage && msg.senderId) {
                    const senderProfile = senderProfiles[msg.senderId];
                    if (senderProfile) {
                      isSenderAdmin = senderProfile.role.toLowerCase() === "admin";
                      senderInitial = senderProfile.fullName.split(" ")[0]?.charAt(0)?.toUpperCase() || "U";
                    }
                  }

                  // Alignment: Current user messages on the right, others (including admin users) on the left
                  const alignClass = isCurrentUserMessage ? "justify-end" : "justify-start";

                  // Determine avatar and styling
                  let avatarLetter = "B"; // Default for bot
                  let avatarColor = "bg-gradient-to-br from-blue-500 to-blue-700"; // Default for bot/support/admin
                  let bubbleColor = "bg-gray-100 text-gray-800 rounded-br-none"; // Default for messages on the left

                  if (isCurrentUserMessage) {
                    // Current user's messages (on the right)
                    avatarLetter = userFirstNameInitial;
                    avatarColor = "bg-gradient-to-br from-blue-600 to-blue-800";
                    bubbleColor = "bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-bl-none";
                  } else if (msg.senderType === "bot") {
                    avatarLetter = "B";
                    avatarColor = "bg-gradient-to-br from-blue-500 to-blue-700";
                    bubbleColor = "bg-gray-100 text-gray-800 rounded-br-none";
                  } else if (msg.senderType === "support" || (msg.senderType === "user" && isSenderAdmin)) {
                    avatarLetter = "A"; // Admin/Support
                    avatarColor = "bg-gradient-to-br from-blue-500 to-blue-700";
                    bubbleColor = "bg-gray-100 text-gray-800 rounded-br-none";
                  } else if (msg.senderType === "user") {
                    // Non-admin user messages (not current user)
                    avatarLetter = senderInitial;
                    avatarColor = "bg-gradient-to-br from-gray-600 to-gray-800";
                    bubbleColor = "bg-gray-100 text-gray-800 rounded-br-none";
                  }

                  return (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`space-y-2 flex items-start gap-3 ${alignClass} fade-in`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {!isCurrentUserMessage && (
                        <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold`}>
                          {avatarLetter}
                        </div>
                      )}
                      <div
                        className={`space-y-1 ${
                          isCurrentUserMessage ? "text-right" : "text-left"
                        }`}
                      >
                        <div className="text-xs text-gray-600 flex items-center gap-2">
                          <span>
                            {isCurrentUserMessage
                              ? "You"
                              : msg.senderType === "bot"
                              ? "Bot"
                              : msg.senderType === "support" || isSenderAdmin
                              ? "Admin"
                              : "User"}
                          </span>
                          <span>·</span>
                          <span>
                            {new Date(msg.timestamp).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                            })}
                          </span>
                        </div>
                        <div
                          className={`inline-block p-4 rounded-2xl max-w-lg shadow-sm ${bubbleColor}`}
                        >
                          {msg.text}
                        </div>
                      </div>
                      {isCurrentUserMessage && (
                        <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold`}>
                          {avatarLetter}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-gray-500 italic flex items-center gap-2 justify-start"
                  >
                    <span>Support is typing</span>
                    <span className="animate-pulse">...</span>
                  </motion.div>
                )}
              </div>

              <div className="p-6 border-t flex items-center gap-4 bg-white">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleReply();
                  }}
                  className="flex-1 border-0 bg-gray-100 px-6 py-3 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleReply}
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:bg-gray-400 text-white p-3 rounded-full flex items-center justify-center shadow-md"
                >
                  <FiSend className="w-5 h-5" />
                </motion.button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-center p-4 bg-red-50 rounded-lg m-4"
                >
                  {error}
                </motion.div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a support thread to start chatting.
            </div>
          )}
        </motion.div>
      </div>

      {/* New Message Notification */}
      <AnimatePresence>
        {showNewMessagePop && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={() => handlePopupClick(showNewMessagePop)}
            className="fixed top-20 right-5 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-6 rounded-lg shadow-xl animate__animated animate__pulse cursor-pointer hover:from-blue-700 hover:to-blue-900 transition-all"
          >
            <p>New message from support!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}