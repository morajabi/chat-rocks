import React, { PureComponent } from 'react'
import { gql, graphql, compose } from 'react-apollo'

import Message from './Message'

class Chat extends PureComponent {
  componentDidMount() {
    this.props.subscribeToNewMessage()
  }

  componentWillReceiveProps(newProps) {
    if (newProps.messages.loading) {
      return
    }

    if (newProps.messages.allMessages !== this.props.messages.allMessages) {
      // if the feed has changed, we need to unsubscribe before resubscribing
      this.props.subscribeToNewMessage()
    } else {
      // we already have an active subscription with the right params
      return
    }
  }

  componentDidUpdate() {
    window.scrollTo(0, document.body.scrollHeight)
  }

  render() {
    const { messages: { allMessages = [], loading = false } } = this.props
    const userId = this.getUserId();

    if (loading) {
      return <div>loading...</div>
    }

    return (
      <div style={{ paddingBottom: '3.5rem' }}>
        {allMessages.map((msg, i) => {
          // Is this message sent by current user?
          const isMe = msg.by ? userId === (msg.by && msg.by.id) : false
          // Get displayName
          const displayName = msg.by && msg.by.displayName

          return (
            <Message
              displayName={isMe ? 'Me' : displayName}
              own={isMe}
              key={i}
            >
              {msg.content}
            </Message>
          )
        })}
      </div>
    )
  }

  getUserId() {
    const { user: { user = {}, loading = false } = {} } = this.props
    return user && !loading ? user.id : null
  }
}

// We need to get logged in user in order to highlight its own
// messages in chat
const getUser = gql`query getUser {
  user {
    id
  }
}`

const getAllMessages = gql`query allMessages {
  allMessages {
    id
    content
    by {
      id
      displayName
    }
  }
}`

const messageSubscription = gql`subscription messageSubscription {
  Message {
    node {
      id
      content
      by {
        id
        displayName
      }
    }
  }
}`

const withData = compose(
  graphql(getUser, {
    name: 'user'
  }),

  graphql(getAllMessages, {
    name: 'messages',
    props: props => {
      return {
        // Rename data to messages
        messages: props.messages,

        // Declare subscriptions function
        subscribeToNewMessage: params => {
          return props.messages.subscribeToMore({
            document: messageSubscription,
            variables: null,

            // Where magic happens
            updateQuery: (prev, { subscriptionData }) => {
              console.log('update query started...')
              if (!subscriptionData.data) {
                return prev;
              }

              console.log('update query 1...')

              const newMessage = subscriptionData.data.Message.node;

              // Check for duplicates
              if (
                newMessage.id === '' ||
                prev.allMessages.find(m => m.id === newMessage.id)
              ) {
                return prev
              }
              console.log('update query 2 (end)')
              console.log('prev allMessages:', prev.allMessages)

              return {
                allMessages: [
                  ...prev.allMessages,
                  {
                    ...newMessage,
                  }
                ]
              }
            }
          })
        }
      }
    }
  })
)

export default withData(Chat)
