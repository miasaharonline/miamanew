"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  MessageSquare,
  Plus,
  X,
  User,
  Send,
  Mic,
  Paperclip,
  Image,
} from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isAI: boolean;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage?: string;
  messages: Message[];
  unread: number;
}

interface Account {
  id: string;
  name: string;
  phone: string;
  status: string;
  conversations: Conversation[];
}

export default function MultiAccountChatInterface({
  userId,
  aiActive = false,
}) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [activeConversations, setActiveConversations] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockAccounts: Account[] = [
      {
        id: "acc1",
        name: "Business Account",
        phone: "+1234567890",
        status: "active",
        conversations: [
          {
            id: "conv1",
            name: "John Doe",
            lastMessage: "Hello, I need help with my order",
            unread: 2,
            messages: [
              {
                id: "msg1",
                sender: "John Doe",
                content: "Hello, I need help with my order",
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                isAI: false,
              },
            ],
          },
          {
            id: "conv2",
            name: "Jane Smith",
            lastMessage: "When will my package arrive?",
            unread: 0,
            messages: [
              {
                id: "msg2",
                sender: "Jane Smith",
                content: "When will my package arrive?",
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                isAI: false,
              },
            ],
          },
        ],
      },
      {
        id: "acc2",
        name: "Support Account",
        phone: "+9876543210",
        status: "active",
        conversations: [
          {
            id: "conv3",
            name: "Technical Support",
            lastMessage: "I'm having issues with the app",
            unread: 1,
            messages: [
              {
                id: "msg3",
                sender: "Technical Support",
                content: "I'm having issues with the app",
                timestamp: new Date(Date.now() - 1800000).toISOString(),
                isAI: false,
              },
            ],
          },
        ],
      },
    ];

    setAccounts(mockAccounts);
    if (mockAccounts.length > 0) {
      setSelectedAccount(mockAccounts[0].id);
      // Open first conversation by default
      if (mockAccounts[0].conversations.length > 0) {
        const firstConvId = mockAccounts[0].conversations[0].id;
        setActiveConversations([firstConvId]);
        setActiveTab(firstConvId);
      }
    }
    setLoading(false);
  }, []);

  const handleAccountChange = (accountId: string) => {
    setSelectedAccount(accountId);
    // Reset active conversations when changing accounts
    setActiveConversations([]);
    setActiveTab("");
  };

  const openConversation = (conversationId: string) => {
    if (!activeConversations.includes(conversationId)) {
      setActiveConversations([...activeConversations, conversationId]);
    }
    setActiveTab(conversationId);
  };

  const closeConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newActiveConversations = activeConversations.filter(
      (id) => id !== conversationId,
    );
    setActiveConversations(newActiveConversations);

    // If we closed the active tab, select another one if available
    if (activeTab === conversationId && newActiveConversations.length > 0) {
      setActiveTab(newActiveConversations[0]);
    } else if (newActiveConversations.length === 0) {
      setActiveTab("");
    }
  };

  const sendMessage = () => {
    if (!message.trim() || !activeTab) return;

    // Find the account and conversation
    const account = accounts.find((acc) => acc.id === selectedAccount);
    if (!account) return;

    const conversationIndex = account.conversations.findIndex(
      (conv) => conv.id === activeTab,
    );
    if (conversationIndex === -1) return;

    // Add user message
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "You",
      content: message,
      timestamp: new Date().toISOString(),
      isAI: false,
    };

    // Create a deep copy of accounts to update
    const updatedAccounts = [...accounts];
    const updatedAccount = {
      ...updatedAccounts.find((acc) => acc.id === selectedAccount)!,
    };
    updatedAccounts[
      updatedAccounts.findIndex((acc) => acc.id === selectedAccount)
    ] = updatedAccount;

    const updatedConversations = [...updatedAccount.conversations];
    const updatedConversation = { ...updatedConversations[conversationIndex] };
    updatedConversations[conversationIndex] = updatedConversation;
    updatedAccount.conversations = updatedConversations;

    updatedConversation.messages = [
      ...updatedConversation.messages,
      newMessage,
    ];
    updatedConversation.lastMessage = message;

    setAccounts(updatedAccounts);
    setMessage("");

    // Simulate AI response if aiActive is true
    if (aiActive) {
      setTimeout(() => {
        const aiResponse: Message = {
          id: `msg-${Date.now()}`,
          sender: "AI Assistant",
          content: "I'm the AI assistant. How can I help you today?",
          timestamp: new Date().toISOString(),
          isAI: true,
        };

        const latestAccounts = [...updatedAccounts];
        const latestAccount = latestAccounts.find(
          (acc) => acc.id === selectedAccount,
        )!;
        const latestConversation = latestAccount.conversations.find(
          (conv) => conv.id === activeTab,
        )!;
        latestConversation.messages = [
          ...latestConversation.messages,
          aiResponse,
        ];
        latestConversation.lastMessage = aiResponse.content;

        setAccounts(latestAccounts);
      }, 1000);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green"></div>
      </div>
    );
  }

  // If no accounts are available
  if (accounts.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 sm:p-8 rounded-lg">
        <div className="text-center p-4 sm:p-8">
          <MessageSquare className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-whatsapp-darkgray opacity-20" />
          <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-whatsapp-text">
            No WhatsApp accounts connected
          </h3>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-whatsapp-darkgray">
            Connect a WhatsApp account to start chatting
          </p>
          <Button className="mt-4 sm:mt-6 bg-whatsapp-green hover:bg-whatsapp-darkgreen text-white text-sm sm:text-base py-1 sm:py-2">
            Connect Account
          </Button>
        </div>
      </div>
    );
  }

  const selectedAccountData = accounts.find(
    (acc) => acc.id === selectedAccount,
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Account Selector */}
      <div className="p-3 sm:p-4 border-b">
        <Select value={selectedAccount} onValueChange={handleAccountChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                <span className="truncate">
                  {account.name} ({account.phone})
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Conversation List */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-b md:border-b-0 md:border-r overflow-y-auto bg-gray-50 max-h-[30vh] md:max-h-none md:h-auto">
          <div className="p-2 sm:p-3 border-b bg-white">
            <Input placeholder="Search conversations..." className="w-full" />
          </div>
          <div className="divide-y">
            {selectedAccountData?.conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-2 sm:p-3 hover:bg-gray-100 cursor-pointer ${activeTab === conversation.id ? "bg-gray-100" : ""}`}
                onClick={() => openConversation(conversation.id)}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-whatsapp-green flex items-center justify-center text-white flex-shrink-0">
                    <User size={16} className="sm:hidden" />
                    <User size={20} className="hidden sm:block" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium truncate text-sm sm:text-base">
                        {conversation.name}
                      </h4>
                      <span className="text-xs text-gray-500 ml-1 flex-shrink-0">
                        {conversation.messages.length > 0
                          ? formatTime(
                              conversation.messages[
                                conversation.messages.length - 1
                              ].timestamp,
                            )
                          : ""}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unread > 0 && (
                    <div className="h-5 w-5 rounded-full bg-whatsapp-green text-white text-xs flex items-center justify-center flex-shrink-0">
                      {conversation.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeConversations.length > 0 ? (
            <>
              {/* Tabs for open conversations */}
              <div className="flex flex-wrap p-0 bg-gray-100 border-b h-auto overflow-x-auto">
                {activeConversations.map((convId) => {
                  const conversation = selectedAccountData?.conversations.find(
                    (c) => c.id === convId,
                  );
                  return (
                    <div
                      key={convId}
                      className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 cursor-pointer ${activeTab === convId ? "bg-white" : ""}`}
                      onClick={() => setActiveTab(convId)}
                    >
                      <span className="truncate max-w-[80px] sm:max-w-[100px] text-xs sm:text-sm">
                        {conversation?.name}
                      </span>
                      <button
                        className="h-4 w-4 rounded-full hover:bg-gray-300 flex items-center justify-center"
                        onClick={(e) => closeConversation(convId, e)}
                      >
                        <X size={10} className="sm:hidden" />
                        <X size={12} className="hidden sm:block" />
                      </button>
                    </div>
                  );
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto ml-1 sm:ml-2"
                  onClick={() => {
                    if (
                      selectedAccountData?.conversations.length &&
                      selectedAccountData.conversations.length >
                        activeConversations.length
                    ) {
                      // Find first conversation that's not already open
                      const unopenedConv =
                        selectedAccountData.conversations.find(
                          (conv) => !activeConversations.includes(conv.id),
                        );
                      if (unopenedConv) {
                        openConversation(unopenedConv.id);
                      }
                    }
                  }}
                >
                  <Plus size={14} className="sm:hidden" />
                  <Plus size={16} className="hidden sm:block" />
                </Button>
              </div>

              {/* Chat content for each tab */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {activeConversations.map((convId) => {
                  const conversation = selectedAccountData?.conversations.find(
                    (c) => c.id === convId,
                  );
                  return (
                    <div
                      key={convId}
                      className={`flex-1 flex flex-col p-0 m-0 overflow-hidden ${activeTab === convId ? "block" : "hidden"}`}
                    >
                      {/* Chat header */}
                      <div className="p-2 sm:p-3 border-b bg-white flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-whatsapp-green flex items-center justify-center text-white">
                            <User size={12} className="sm:hidden" />
                            <User size={16} className="hidden sm:block" />
                          </div>
                          <h3 className="font-medium text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                            {conversation?.name}
                          </h3>
                        </div>
                        <div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8"
                          >
                            {aiActive ? "AI Active" : "AI Inactive"}
                          </Button>
                        </div>
                      </div>
                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-[#ededed]">
                        {conversation?.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`mb-3 sm:mb-4 flex ${msg.isAI ? "justify-start" : "justify-end"}`}
                          >
                            <div
                              className={`max-w-[85%] sm:max-w-[70%] p-2 sm:p-3 rounded-lg text-sm sm:text-base ${
                                msg.isAI
                                  ? "bg-white text-black"
                                  : "bg-whatsapp-green text-white"
                              }`}
                            >
                              <p>{msg.content}</p>
                              <div
                                className={`text-[10px] sm:text-xs mt-1 text-right ${msg.isAI ? "text-gray-500" : "text-whatsapp-lightgreen"}`}
                              >
                                {formatTime(msg.timestamp)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Message input */}
                      <div className="p-2 sm:p-3 border-t bg-white flex items-center gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex"
                        >
                          <Paperclip size={18} className="sm:hidden" />
                          <Paperclip size={20} className="hidden sm:block" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 sm:h-10 sm:w-10"
                        >
                          <Image size={18} className="sm:hidden" />
                          <Image size={20} className="hidden sm:block" />
                        </Button>
                        <Input
                          placeholder="Type a message"
                          className="flex-1 h-8 sm:h-10 text-sm sm:text-base"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex"
                        >
                          <Mic size={18} className="sm:hidden" />
                          <Mic size={20} className="hidden sm:block" />
                        </Button>
                        <Button
                          className="bg-whatsapp-green hover:bg-whatsapp-darkgreen text-white rounded-full h-8 w-8 sm:h-10 sm:w-10 p-0 flex-shrink-0"
                          onClick={sendMessage}
                        >
                          <Send size={16} className="sm:hidden" />
                          <Send size={18} className="hidden sm:block" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center p-4 sm:p-8">
                <MessageSquare className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-whatsapp-darkgray opacity-20" />
                <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-whatsapp-text">
                  Select a conversation to start chatting
                </h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-whatsapp-darkgray">
                  Click on a conversation from the list
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
