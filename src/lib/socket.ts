
import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

export const connectSocket = (appointmentId: string, token: string) => {
  socket = io("https://api.yourdomain.com", {
    path: "/chat",
    query: { appointmentId },
    auth: { token },
  })
  return socket
}

export const getSocket = () => socket
export const disconnectSocket = () => {
  if (socket) socket.disconnect()
}
