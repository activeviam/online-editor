import React from "react";
//import { parse } from "@online-editor-2020/parser";
import { mockInput } from './mock_token'
import { TokenComponent } from './token_renderer'

const App = () => 
  <div
    style={{
      position: 'absolute', left: '50%', top: '50%',
      transform: 'translate(-50%, -50%)'
    }}
  >
    {mockInput.map((token, index) => 
      <TokenComponent token={token} key={index}/>
    )}
  </div>

export default App;