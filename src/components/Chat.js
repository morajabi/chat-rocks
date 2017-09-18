import React from 'react'
import Message from './Message'

const Chat = ({ messages = [] }) => (
  <div>
    {messages.map(msg => (
      <Message>{msg}</Message>
    ))}
  </div>
)

export default Chat
