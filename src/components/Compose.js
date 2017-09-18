import React from 'react'
import styled from 'styled-components'

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

const Compose = () => (
  <Wrapper onSubmit={e => e.preventDefault()}>
    <Input />
    <SendButton>Send</SendButton>
  </Wrapper>
)

export default Compose
