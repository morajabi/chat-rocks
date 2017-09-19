import React from 'react'
import styled, { css } from 'styled-components'

const Wrapper = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;

  ${p => p.own && css`
    background: #f0f0f0;
  `}

  &:last-child {
    border-bottom: none;
  }
`

const Message = ({ displayName, own = false, children }) => (
  <Wrapper own={own}>
    {displayName &&
      <strong>{displayName}</strong>
    }
    &nbsp;{children}
  </Wrapper>
)

export default Message
