import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { gql, graphql } from 'react-apollo'

const Wrapper = styled.form`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  align-items: center;
  padding: 0 .8rem;
  height: 3.5rem;
  background: #eee;
`

const Input = styled.input`
  flex: 0 1 100%;
  height: 2rem;
  padding: 0 .3rem;
  font-size: 1em;
  border: 1px solid #ccc;
  background: white;
`

const SendButton = styled.button`
  flex: 0 0 auto;
  height: 2rem;
  padding: 0 1rem;
  margin-left: .8rem;
  font-size: 0.9em;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  border: none;
  background: black;
  color: white;
`

class Compose extends PureComponent {

  static defaultProps = {
    mutate: () => {}
  }

  state = {
    content: ''
  }

  render() {
    return (
      <Wrapper onSubmit={this.submitted}>
        <Input
          value={this.state.content}
          onChange={this.inputChanged}
        />
        <SendButton>Send</SendButton>
      </Wrapper>
    )
  }

  inputChanged = e => {
    this.setState({ content: e.target.value })
  }

  submitted = e => {
    e.preventDefault()

    if (this.state.content.trim() === '') {
      return
    }

    this.props.mutate({
      variables: { content: this.state.content },
      // Add quick optimistic response for better UX
      optimisticResponse: {
        __typename: 'Mutation',
        createMessage: {
          __typename: 'Message', // We need to declare all these
          id: '',
          content: this.state.content,
        },
      },
    }).then(({ data }) => {
      console.log('messsage sent: ', data)
    }).catch((error) => {
      console.log('error occurred while sending message: ', error)
    })

    this.setState({ content: '' })
  }
}

const createMessage = gql`mutation createMessage($content: String!) {
  createMessage(content: $content) {
    id
    content
  }
}`

const getAllMessages = gql`query {
  allMessages {
    id
    content
  }
}`

export default graphql(createMessage, {
  options: {
    // Define how should Apollo update the cache.
    // We don't need to handle duplicate entries here,
    // Apollo takes care of that for now.
    update: (proxy, { data: { createMessage } }) => {
      const data = proxy.readQuery({ query: getAllMessages });
      data.allMessages.push(createMessage);
      proxy.writeQuery({ query: getAllMessages, data });
    },
  },
})(Compose)
