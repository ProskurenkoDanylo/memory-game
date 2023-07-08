import { render, fireEvent } from '@testing-library/react';
import ButtonOrLink from './ButtonOrLink';
import { BrowserRouter } from 'react-router-dom';

describe('ButtonOrLink', () => {
  test('renders a button with text', () => {
    const { getByText } = render(<ButtonOrLink>Click me</ButtonOrLink>);
    const button = getByText('Click me');
    expect(button).toBeInTheDocument();
  });

  test('renders a link with text and href', () => {
    const { getByText } = render(
      <BrowserRouter>
        <ButtonOrLink link="/home">Go home</ButtonOrLink>
      </BrowserRouter>
    );
    const link = getByText('Go home');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/home');
  });

  test('applies styles to button', () => {
    const { getByText } = render(
      <ButtonOrLink $colors="#FF0000" $textColor="#FFFFFF">
        Styled button
      </ButtonOrLink>
    );
    const button = getByText('Styled button');
    expect(button).toHaveStyle('background: #FF0000');
    expect(button).toHaveStyle('color: #FFFFFF');
  });

  test('applies styles to link', () => {
    const { getByText } = render(
      <BrowserRouter>
        <ButtonOrLink link="/home" $colors="#FF0000" $textColor="#FFFFFF">
          Styled link
        </ButtonOrLink>
      </BrowserRouter>
    );
    const link = getByText('Styled link');
    expect(link).toHaveStyle('background: #FF0000');
    expect(link).toHaveStyle('color: #FFFFFF');
  });

  test('calls onClick function when button is clicked', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <ButtonOrLink onClick={handleClick}>Click me</ButtonOrLink>
    );
    const button = getByText('Click me');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
