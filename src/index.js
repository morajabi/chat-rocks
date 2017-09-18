import React from 'react'
import ReactDOM from 'react-dom'
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { addGraphQLSubscriptions } from 'add-graphql-subscriptions'
// We should upgrade to apollo v2 and apollo-link and latest
// subscriptions-transport-ws instead of these three packages

import App from './components/App'

// Setup socket client for subscriptions
const wsClient = new SubscriptionClient(
  `wss://subscriptions.graph.cool/v1/chat-rocks`,
  {
    reconnect: true
  }
)

const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/chat-rocks',
})

// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
)

const apolloClient = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
})

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
