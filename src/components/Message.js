import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
`

const Message = ({ children }) => (
  <Wrapper>
    {children}
  </Wrapper>
)

export default Message
