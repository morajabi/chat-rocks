import React, { Component } from 'react'

import Chat from './Chat'
import Compose from './Compose'

class App extends Component {
  render() {
    return (
      <div>
        <Compose />
        <Chat />
      </div>
    )
  }
}

export default App
