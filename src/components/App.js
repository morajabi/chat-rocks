import React, { Component } from 'react'
import Chat from './Chat'

class App extends Component {
  render() {
    return (
      <Chat messages={['hi', 'foo']} />
    )
  }
}

export default App
