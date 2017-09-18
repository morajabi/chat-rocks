import React from 'react'
import { gql, graphql } from 'react-apollo'

import Message from './Message'

const Chat = ({ data: { allMessages = [], loading = false } }) => {
  if (loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      {allMessages.map(msg => (
        <Message>{msg.content}</Message>
      ))}
    </div>
  )
}

const getAllMessages = gql`query allMessages {
  allMessages {
    content
  }
}`

export default graphql(getAllMessages)(Chat)
