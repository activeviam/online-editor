import React from 'react';
import { render } from '@testing-library/react';
import { TokenComponent } from './token_renderer'
import { expectedKeywords, mockInput } from './mock_token'

test('renders keywords', () => {
  mockInput.map((tokenId, i) => {
    const expectedKeyword = expectedKeywords[i];
    if (expectedKeyword != " ") {
      const { getByText } = render(<TokenComponent tokenId={tokenId}></TokenComponent>);
      const keywordElement = getByText(expectedKeyword);
      expect(keywordElement).toBeInTheDocument();
    }
  })
})
