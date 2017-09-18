import React from 'react'
import ReactDOM from 'react-dom'
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo'

import App from './components/App'

const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/chat-rocks',
})

const apolloClient = new ApolloClient({
  networkInterface,
})

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
