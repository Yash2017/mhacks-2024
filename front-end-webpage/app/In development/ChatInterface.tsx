'use client'

import { useState } from 'react'
import { Button } from "@/app/In development/ui/button"
import { Input } from "@/app/In development/ui/user-input"
import { ScrollArea } from "@/app/In development/ui/scroll-area"
import { PlusIcon, SendIcon } from 'lucide-react'

export default function ChatInterface() {
  const [chats, setChats] = useState([{ id: 1, name: 'New chat' }])
  const [activeChat, setActiveChat] = useState(1)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [input, setInput] = useState('')

  const handleNewChat = () => {
    const newChat = { id: chats.length + 1, name: 'New chat' }
    setChats([...chats, newChat])
    setActiveChat(newChat.id)
    setMessages([])
  }

  const handleSend = async () => {
    if (input.trim() === '') return

    const newMessages = [...messages, { role: 'user', content: input }]
    //issue in pages, see pages to fix
    setMessages(newMessages)
    setInput('')

    // Simulating a response from the backend
    setTimeout(() => {
      setMessages([...newMessages, { role: 'assistant', content: 'This is a simulated response from the AI.' }])
    }, 1000)
  }

  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <Button onClick={handleNewChat} className="mb-4 flex items-center justify-center gap-2">
          <PlusIcon className="w-4 h-4" />
          New chat
        </Button>
        <ScrollArea className="flex-grow">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              variant={activeChat === chat.id ? "secondary" : "ghost"}
              className="w-full justify-start mb-2"
              onClick={() => setActiveChat(chat.id)}
            >
              {chat.name}
            </Button>
          ))}
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Model selection */}
        <div className="bg-white p-4 shadow">
          <Button variant="outline">ChatGPT 4.0</Button>
        </div>

        {/* Chat area */}
        <ScrollArea className="flex-grow p-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {message.content}
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Input area */}
        <div className="p-4 bg-white">
          <div className="flex items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-grow mr-2"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend}>
              <SendIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}