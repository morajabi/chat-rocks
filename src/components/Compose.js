import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { gql, graphql } from 'react-apollo'

const Wrapper = styled.form`
  display: block;
  margin: 10px 0;
`

const Input = styled.input`
  width: 100%;
  max-width: 30vw;
  height: 2rem;
  padding: 0 .3rem;
  font-size: 1em;
  border: 1px solid #ccc;
  background: white;
`

const SendButton = styled.button`
  display: inline-block;
  height: 2rem;
  padding: 0 1rem;
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
    this.props.mutate({
      variables: { content: this.state.content },
      optimisticResponse: {
        __typename: 'Mutation',
        createMessage: {
          __typename: 'Message',
          id: '',
          content: this.state.content,
        },
      },
    }).then(({ data }) => {
      console.log('messsage sent: ', data)
      // Clear the input
      this.setState({ content: '' })
    }).catch((error) => {
      console.log('error occurred while sending message: ', error)
    })
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
    update: (proxy, { data: { createMessage } }) => {
      const data = proxy.readQuery({ query: getAllMessages });
      data.allMessages.push(createMessage);
      console.log(data)
      proxy.writeQuery({ query: getAllMessages, data });
    },
  },
})(Compose)
