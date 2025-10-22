import { useEffect, useRef } from "react"

export function useWebSocket() {
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000")
    socketRef.current = socket

    socket.onopen = () => {
      console.log("✅ WS connected from client")
    }

    socket.onclose = () => {
      console.log("❌ WS disconnected from client")
    }

    socket.onerror = (error) => {
      console.error("⚠️ WS error:", error)
    }

    // optional: log messages from server
    socket.onmessage = (event) => {
      console.log("📩 Message from server:", event.data)
    }

    // cleanup on unmount
    return () => {
      socket.close()
    }
  }, [])

  return socketRef
}
