import React, { PureComponent } from 'react'
import { gql, graphql } from 'react-apollo'

import Message from './Message'

class Chat extends PureComponent {
  componentDidMount() {
    this.props.subscribeToNewMessage()
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
    content
  }
}`


const messageSubscription = gql`subscription messageSubscription {
  Message {
    node {
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

            return {
              allMessages: [
                {
                  ...newMessage
                },
                ...prev.allMessages
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
