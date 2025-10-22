// src/pages/Chatbot/ChatbotPage.tsx
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"

export default function ChatbotPage() {
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([])
  const [input, setInput] = useState("")

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = { from: "user", text: input }
    setMessages((prev) => [...prev, userMsg])
    setInput("")

    const { data } = await axios.post("/api/chatbot/query", { query: input })
    setMessages((prev) => [...prev, { from: "bot", text: data.reply }])
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4 flex flex-col items-center">
      <div className="max-w-md w-full border rounded-2xl p-4 space-y-4">
        <div className="h-96 overflow-y-auto bg-muted/40 rounded-lg p-3 space-y-2">
          {messages.map((m, i) => (
            <p
              key={i}
              className={`p-2 rounded-lg max-w-[80%] ${
                m.from === "user" ? "bg-primary text-white ml-auto" : "bg-muted"
              }`}
            >
              {m.text}
            </p>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Ask the bot..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  )
}
