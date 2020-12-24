import React from 'react';
import { render } from '@testing-library/react';
import { TokenComponent } from './token_renderer'
import { expectedText, mockInput } from './mock_token'

test('renders keywords', () => {
  mockInput.map((token, i) => {
    const expectedOutput = expectedText[i];
    if (expectedOutput != " ") {
      const { getByText } = render(<TokenComponent token={token}></TokenComponent>);
      const keywordElement = getByText(expectedOutput);
      expect(keywordElement).toBeInTheDocument();
    }
  })
})
