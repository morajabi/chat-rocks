import React, { Component } from 'react'

import Chat from './Chat'
import Compose from './Compose'
import Login from './Login'

class App extends Component {
  render() {
    return (
      <div>
        <Login />
        <Chat />
        <Compose />
      </div>
    )
  }
}

export default App
