import React from 'react';
import { render, screen } from '@testing-library/react';
import Input from './Input';

describe('Layout', () => {
  it('has "is-invalid" class when errorMessage is set', () => {
    render(<Input errorMessage="error message test" id="test" />);
    const input = screen.queryByTestId('test');

    expect(input.classList).toContain('is-invalid');
  });

  it('has "invalid-feedback" class when errorMessage is set', () => {
    render(<Input errorMessage="error message test" id="test" />);
    const message = screen.queryByTestId('test-span');

    expect(message.classList).toContain('invalid-feedback');
  });

  it('does not have "is-invalid" class when errorMessage is not set', () => {
    render(<Input id="test" />);
    const input = screen.queryByTestId('test');

    expect(input.classList).not.toContain('is-invalid');
  });

  xit('does not have "invalid-feedback" class when errorMessage is not set', () => {
    render(<Input id="test" />);
    const message = screen.queryByTestId('test-span');

    expect(message.classList).not.toContain('invalid-feedback');
  });
});
