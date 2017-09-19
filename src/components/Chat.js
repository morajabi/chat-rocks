import React, { PureComponent } from 'react'
import { gql, graphql } from 'react-apollo'

import Message from './Message'

class Chat extends PureComponent {
  componentDidMount() {
    this.props.subscribeToNewMessage()
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.messages.loading) {
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

  render() {
    const { messages: { allMessages = [], loading = false } } = this.props

    if (loading) {
      return <div>loading...</div>
    }

    return (
      <div>
        {allMessages.map((msg, i) => (
          <Message key={i}>{msg.content}</Message>
        ))}
      </div>
    )
  }
}

const getAllMessages = gql`query allMessages {
  allMessages {
    id
    content
  }
}`


const messageSubscription = gql`subscription messageSubscription {
  Message {
    node {
      id
      content
    }
  }
}`

const withData = graphql(getAllMessages, {
  name: 'messages',
  props: props => {
    return {
      messages: props.messages,
      subscribeToNewMessage: params => {
        return props.messages.subscribeToMore({
          document: messageSubscription,
          variables: null,

          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const newMessage = subscriptionData.data.Message.node;

            if (
              newMessage.id === '' ||
              prev.allMessages.find(m => m.id === newMessage.id)
            ) {
              return prev
            }

            return {
              allMessages: [
                ...prev.allMessages,
                {
                  ...newMessage
                }
              ]
            }
          }
        })
      }
    }
  }
})

// export default graphql(getAllMessages)(Chat)
export default withData(Chat)
