import React, { Fragment } from 'react'
import { Token } from '@online-editor-2020/parser'

/* This component is used to render tokens by reading
   their TokenInfo properties. (See parser/tokens.js)
*/

const BlockStatement = ({children}: any) => {
  return (
    <Fragment>
      <span>{<span>
      {children}
      </span>}</span>
    </Fragment>
  )
}

export const TokenComponent = (props: { token: Token }) => {
  const { token } = props;
  const text = token.getText();

  return (
  <BlockStatement>
    {text}
  </BlockStatement>
  )
}

