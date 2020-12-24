import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders const', () => {
  const { getByText } = render(<App />);
  const expressionElement = getByText(/const/i);
  expect(expressionElement).toBeInTheDocument();
})

test('renders identifier a', () => {
  const { getByText } = render(<App />);
  const expressionElement = getByText(/a/i);
  expect(expressionElement).toBeInTheDocument();
})

test('renders =', () => {
  const { getByText } = render(<App />);
  const expressionElement = getByText(/=/i);
  expect(expressionElement).toBeInTheDocument();
})

test('renders numberLiteral 1', () => {
  const { getByText } = render(<App />);
  const expressionElement = getByText(/1/i);
  expect(expressionElement).toBeInTheDocument();
})
