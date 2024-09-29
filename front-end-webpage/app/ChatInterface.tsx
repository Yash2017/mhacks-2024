'use client'

import { useState } from 'react'
import { Button } from "@/app/ui/button"
import { Input } from "@/app/ui/user-input"
import { ScrollArea } from "@/app/ui/scroll-area"
import { PlusIcon, SendIcon } from 'lucide-react'

interface Chat {
  id: number;
  name: string;
  messages: Array<{ role: 'user' | 'assistant', content: string }>;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [chats, setChats] = useState<Chat[]>([{ id: 1, name: 'New chat', messages: [] }])
  const [activeChat, setActiveChat] = useState(1)
  const [input, setInput] = useState('')

  //adding a new chat, new chats would include a message chain, id, and things like that
  const handleNewChat = () => {
    const newChat: Chat = { id: chats.length + 1, name: `New chat ${chats.length + 1}`, messages: [] }
    setChats([...chats, newChat])
    setActiveChat(newChat.id)
    setInput('')
  }

  //gets the model text generation based on the prompt
  /*fetch('http://localhost:1337/onclick', {
    method: 'POST', // Ensure you're using the correct HTTP method
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        id: '1',
        ai: '1',
    }),
})
.then(response => {
    console.log('Response Status:', response.status); // Log the status
    return response.json(); // Parse the JSON response
})
.then(data => console.log(data))
.catch(error => console.error('Error:', error));*/
  //requires ai number, id of the message channel, and 
    //json's last item is chat id
    
  

  //fetch()

  // Function to send data
const FetchJsonInfoDefaultclickmodel = async (url = 'http://localhost:1337/clickmodel', data = {}) => {
  try {
    const response = await fetch(url, {
      method: 'POST', // Set the method to POST
      headers: {
        'Content-Type': 'application/json', // Specify content type as JSON
      },
      body: JSON.stringify(data), // Convert the data to JSON
    });

    // Check if the response is OK (status in the range 200-299)
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json(); // Parse JSON response
    return responseData; // Return the response data
  } catch (error) {
    console.error('Error:', error);
    return null; // Return null in case of error
  }
};

  //async waits a bit
//
  //const 
  
  //add later, id = number, delete deletes a chat, but we keep incrementing based on the previous item
  //saved array on my side, and ill send that chat id for the over aspect

  // Function to fetch data and get 'msg' element
const fetchMsg = async (host: string) => {
  try {
    const response: any = await fetch(host);

    // Check if the response is OK
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json(); // Parse JSON response

    // Use a lambda function to return the message
    const getMessage = (msg: string): string => msg; // Lambda function to return the message
    return getMessage(data.msg); // Return the 'msg' element
  } catch (error) {
    console.error('Error fetching data:', error);
    return null; // Return null in case of error
  }
}

  //updates backend every time a tab is made
  const onUpdateTab = (updatedValue) => {
    let newChatTabs = setChats;
    return newChatTabs;
  }

  //updates backend every time a message is done
  const onUpdateMsg = (newMsgInfo) => {
    fetch('http://localhost:1337/msgupdate', )
  }

  //gets the lists from json for switching AI models, this is going to be a constant and not used b/c too hard
  const getitem = (fetchedObject: string) => {
    fetch(fetchedObject)
        .then((response) => response.json())
        .then(())
        .catch((error) => console.error("Error fetching data:", error));
    }, []);
  }

  //receives and sends the messages based on the received prompts
  const handleSend = async () => {
    if (input.trim() === '') return

    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat) {
        const newMessages = [...chat.messages, { role: 'user' as const, content: input }]
        return { ...chat, messages: newMessages }
      }
      return chat
    })
  
    let currAI = await clickmodelFetch('http://localhost:1337/clickmodel')
    currAI[""]

    let timestamp: string = [new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()].join();
    let addMessageToDatabase = {
      id: activeChat,
      msg: Input, // this is one message prompt
      name: 'user',
      ai: currAI, //get from backend
      time: timestamp
    };
  
    let hostInfoonmsg = 'http://localhost:1337/onmsg';
  
    // Simulating a response from the backend
    setTimeout(() => {
      const responseChats = updatedChats.map(chat => {
        if (chat.id === activeChat) {
          const newMessages = [...chat.messages, { role: 'assistant' as const, content: 'This is a simulated response from the AI.' }]
          return { ...chat, messages: newMessages }
        }
        return chat
      })
      setChats(responseChats)
    }, 1000)
  }
  };
  


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
              className={activeChat === chat.id ? "w-full justify-start mb-2 bg-secondary text-secondary-foreground hover:bg-secondary/80" : "w-full justify-start mb-2 hover:bg-accent hover:text-accent-foreground"} //
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
              onChange={(message) => setInput(message.target.value)}
              placeholder="Type your message here..."
              className="flex-grow mr-2"
              onKeyDown={(message) => message.key === 'Enter' && handleSend()}
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