"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export function FullPageChat() {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I am your digital therapist! How can I help you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");

      // Here you would typically send the message to your backend
      // and then add the response to the messages

      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:1337/onclick", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();

        // Add the bot's response to the chat
        const botMessage = { text: data.response, sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <header className="bg-white shadow-md">
        <h1 className="text-2xl font-bold text-center py-4 text-blue-600">
          MentalGPT
        </h1>
      </header>

      <main className="flex-grow overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg w-fit max-w-[30] ${
              message.sender === "user" ? "bg-blue-200 ml-auto" : "bg-green-200"
            }`}
          >
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="bg-white p-4 shadow-md">
        <div className="max-w-2xl mx-auto flex space-x-2">
          <Input
            className="flex-grow"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
          </Button>
        </div>
      </footer>
    </div>
  );
}
