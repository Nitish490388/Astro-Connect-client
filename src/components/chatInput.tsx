
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Paperclip, Send } from "lucide-react"

interface Props {
  onSend: (message: string) => void
  onFileSelect?: (file: File) => void
}

export function ChatInput({ onSend, onFileSelect }: Props) {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (!message.trim()) return
    onSend(message)
    setMessage("")
  }

  return (
    <div className="flex items-center gap-2 p-3 border-t">
      <label className="cursor-pointer">
        <Paperclip size={18} className="text-muted-foreground" />
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) onFileSelect?.(e.target.files[0])
          }}
        />
      </label>

      <Input
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <Button onClick={handleSend} size="sm">
        <Send size={16} />
      </Button>
    </div>
  )
}
