import ChatInterface from '@/app/ChatInterface'

export default function Home() {
  return (
    <main className="flex h-screen bg-gradient-to-r from-white via-blue-100 to-white">
      <ChatInterface />
    </main>
  )
}