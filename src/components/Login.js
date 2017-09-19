import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { gql, graphql, compose, withApollo } from 'react-apollo'
import Auth0Lock from 'auth0-lock'

const domain = 'justonerocks.eu.auth0.com'
const clientId = 'c9HyJCtsaBKuYBnxvDRv4bJNJRZiajqV'

class Login extends PureComponent {
  componentDidMount() {
    this.lock = new Auth0Lock(clientId, domain, {  allowSignUp: true})
    this.lock.on('authenticated', this.authenticated)
    // Handle body scroll
    this.lock.on('show', () => document.body.style.overflow = 'hidden')
    this.lock.on('hide', () => document.body.style.overflow = 'auto')
  }

  render() {
    const { data: { user, loading } } = this.props

    if (loading) {
      return null
    }

    if (user) {
      const { picture, displayName } = user
      return (
        <Wrapper>
          <UserInfo>
            <img
              src={picture}
              alt={displayName}
            />
            <span>Hi, {displayName}</span>
          </UserInfo>
          <Button
            color="grey"
            onClick={this.logoutClicked}
          >
            Logout
          </Button>
        </Wrapper>
      )
    }

    return (
      <Wrapper>
        <Button
          color="green"
          onClick={this.loginClicked}
        >
          Login with Twitter or Facebook
        </Button>
      </Wrapper>
    )
  }

  authenticated = ({ accessToken, idToken }) => {
    this.lock.getUserInfo(accessToken, async (error, profile) => {
      if (error) {
        console.log('error on login:', error)
      }
      // Set the token to authorize apollo requests to server
      localStorage.setItem('auth0IdToken', idToken)
      console.log('logged in user profile:', profile)

      console.log('props before reset:', this.props)
      const reset = await this.props.client.resetStore()
      console.log('store reseted:', reset)
      console.log('props after reset:', this.props)

      if (this.props.data.user) {
        // If we've already registred this user,
        // skip the user creation part
        return
      }

      // Construct user object
      const newUser = {
        idToken,
        displayName: profile.nickname,
        email: '',
        picture: profile.picture,
      }

      // Create user in server
      this.props.createUser({
        variables: {
          ...newUser
        },

        optimisticResponse: {
          __typename: 'Mutation',
          createUser: {
            __typename: 'User',
            id: '',
            ...newUser
          }
        }
      }).then(d => {
        console.log('user created!', d)
      }).catch(e => {
        console.log('error in createUser:', e)
        alert('Sorry, we had a problem with login. Can you try again?')
      })
    })
  }

  loginClicked = e => {
    this.lock.show()
  }

  logoutClicked = e => {
    // Remove Auth0 token to remove authorization token from headers
    localStorage.removeItem('auth0IdToken');
    // Refresh to reset apollo
    window.location.replace('/')
    // todo: reset apollo in the proper way :)
  }
}

const createUser = gql`
mutation createUser (
  $idToken: String!,
  $displayName: String!,
  $email: String!,
  $picture: String!
) {
  createUser(
    authProvider: { auth0: { idToken: $idToken }},
    displayName: $displayName,
    email: $email,
    picture: $picture,
  ) {
    id
    displayName
    picture
  }
}
`

const getUser = gql`query getUser {
  user {
    id
    displayName
    picture
  }
}`

export default compose(
  graphql(createUser, {
    name: 'createUser',
    options: {
      update(proxy, { data: { createUser } }) {
        const data = proxy.readQuery({ query: getUser })
        data.user = { ...createUser }
        console.log(data.user)
        proxy.writeQuery({ query: getUser, data })
      }
    }
  }),
  graphql(getUser, {
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  withApollo
)(Login)

const Wrapper = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;

  display: flex;
  font-size: 1rem;
  font-family: sans-serif;
`

const Button = styled.button`
  display: block;
  height: 2.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;

  background: ${p => p.color};
  color: white;
  border: none;

  &:hover,
  &:focus {
    background: dark${p => p.color || 'green'};
  }
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  height: 2.5rem;
  margin-right: .8rem;

  box-sizing: border-box;
  background: white;
  border: 2px solid darkGreen;
  color: darkGreen;

  span {
    padding: 0.5rem 1rem;
  }

  img {
    height: 100%;
  }
`
