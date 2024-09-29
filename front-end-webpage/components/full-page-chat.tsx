"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Plus,
  Send,
  MessageCircle,
  Sparkles,
  Brain,
  Leaf,
  Cloud,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

export default function FullPageChat() {
  let lstore = localStorage.getItem("mentalgpt_chats");
  console.log(lstore);
  let data = [];
  if (lstore == "" || lstore == null) {
    data = [
      {
        id: 1,
        name: "Chat 1",
        messages: [
          {
            content:
              "Hello! Welcome to MentalGPT. I am your mental assistant. How can I help you today?",
            role: "system",
          },
        ],
      },
    ];
  } else {
    data = JSON.parse(lstore);
  }
  const [chats, setChats] = useState(data);
  useEffect(() => {
    setChats(data);
  }, []);
  const [activeChat, setActiveChat] = useState(1);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chats]);
  useEffect(() => {
    localStorage.setItem("mentalgpt_chats", JSON.stringify(chats));
  }, [chats]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { content: input, role: "user" };
      updateChat(activeChat, userMessage);
      setInput("");
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:1337/onmsg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();
        const botMessage = { content: data.msg.content, role: "system" };
        updateChat(activeChat, botMessage);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        updateChat(activeChat, {
          content: "Sorry, there was an error processing your request.",
          role: "system",
        });
        console.log(error);
      }
    }
  };

  const updateChat = (chatId, newMessage) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );
  };

  const addNewChat = () => {
    const newChatId = chats.length + 1;
    const newChat = {
      id: newChatId,
      name: `Chat ${newChatId}`,
      messages: [
        {
          content:
            "Hello! I am your mental therapist. How can I help you today?",
          role: "system",
        },
      ],
    };
    setChats([...chats, newChat]);
    setActiveChat(newChatId);
  };

  return (
    <div className="flex h-screen w-screen bg-[#B3E9C7] overflow-hidden relative">
      {/* Decorative elements */}
      <motion.div
        className="absolute top-10 left-10 text-[#5603AD] opacity-10"
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Brain size={100} />
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-10 text-[#5603AD] opacity-10"
        animate={{
          rotate: -360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Leaf size={80} />
      </motion.div>
      <motion.div
        className="absolute top-1/2 right-1/4 text-[#5603AD] opacity-10"
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Cloud size={60} />
      </motion.div>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-64 bg-white shadow-md flex flex-col"
      >
        <header className="p-4 border-b bg-[#5603AD] text-white">
          <h2 className="text-xl font-bold flex items-center">
            <Sparkles className="mr-2 h-6 w-5" />
            MentalGPT
          </h2>
        </header>
        <ScrollArea className="flex-grow">
          <AnimatePresence>
            {chats.map((chat) => (
              <motion.button
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`w-full text-left p-3 hover:bg-[#E6F7EC] transition-colors ${
                  activeChat === chat.id ? "bg-[#B3E9C7] text-[#5603AD]" : ""
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="inline-block mr-2 h-4 w-4" />
                {chat.name}
              </motion.button>
            ))}
          </AnimatePresence>
        </ScrollArea>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={addNewChat}
            className="m-4 bg-[#5603AD] text-white hover:bg-[#6E14C5] w-[calc(100%-2rem)]"
          >
            <Plus className="mr-2 h-4 w-4" /> New Chat
          </Button>
        </motion.div>
      </motion.aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        <motion.header
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-[#5603AD] shadow-md"
        >
          <h1 className="text-xl font-bold text-center py-4 text-white flex items-center justify-center">
            <Brain className="mr-2 h-6 w-6" />
            Welcome to MentalGPT
          </h1>
        </motion.header>

        <main className="flex-grow overflow-auto p-4 space-y-4 bg-[#F5FDF8]">
          <AnimatePresence>
            {chats
              .find((chat) => chat.id === activeChat)
              ?.messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`p-3 rounded-lg w-fit max-w-[30%] ${
                    message.role === "user"
                      ? "bg-[#B3E9C7] ml-auto text-[#5603AD]"
                      : "bg-[#85D6C3] text-[#5603AD]"
                  } max-w-[70%] break-words shadow-sm`}
                  whileHover={{ scale: 1.05 }}
                >
                  {message.content}
                </motion.div>
              ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </main>

        <motion.footer
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-white p-4 shadow-md"
        >
          <div className="max-w-4xl mx-auto flex space-x-2">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
              className="flex-grow"
            >
              <Input
                className="flex-grow border-[#B3E9C7] focus:ring-2 focus:ring-[#5603AD]"
                placeholder="Type your message here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && !isLoading && handleSend()
                }
                disabled={isLoading}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-[#5603AD] text-white hover:bg-[#6E14C5]"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
