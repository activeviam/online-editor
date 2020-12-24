import React, { Fragment } from 'react'
import { lookupToken, TokenID } from '@online-editor-2020/parser'

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

export const TokenComponent = (props: { tokenId: TokenID }) => {
  const { tokenId } = props;
  const tokenInfo = lookupToken(tokenId);
  const { text } = tokenInfo;

  return (
  <BlockStatement>
    {text}
  </BlockStatement>
  )
}

