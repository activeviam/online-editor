import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders const', () => {
  const { getByText } = render(<App />);
  const expressionElement = getByText(/const/i);
  expect(expressionElement).toBeInTheDocument();
})

test('renders identifier', () => {
  const { getByText } = render(<App />);
  const expressionElement = getByText(/identifier/i);
  expect(expressionElement).toBeInTheDocument();
})

test('renders =', () => {
  const { getByText } = render(<App />);
  const expressionElement = getByText(/=/i);
  expect(expressionElement).toBeInTheDocument();
})

test('renders numberLiteral', () => {
  const { getByText } = render(<App />);
  const expressionElement = getByText(/numberLiteral/i);
  expect(expressionElement).toBeInTheDocument();
})
