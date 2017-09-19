import React, { Component } from 'react'

import Chat from './Chat'
import Compose from './Compose'

class App extends Component {
  render() {
    return (
      <div>
        <Chat />
        <Compose />
      </div>
    )
  }
}

export default App
