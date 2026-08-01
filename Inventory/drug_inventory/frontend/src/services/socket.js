import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js"

export const socket = io("http://localhost:5000", {
  autoConnect: false
})

export function connectSocket() {
  socket.connect()
}
