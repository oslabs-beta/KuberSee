import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import NotFound from './NotFound';

describe('NotFound tests', () => {
  it('should contains the heading 1', () => {
    render(
      <NotFound />
    )
    const heading = screen.getByText(/Not Found/i);
    expect(heading).toBeInTheDocument()
  });
});