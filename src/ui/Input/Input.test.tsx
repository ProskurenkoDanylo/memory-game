import { render } from '@testing-library/react';
import Input from './Input';

test('renders without crashing', () => {
  render(<Input name="test" value="" onChange={() => {}} />);
});

test('renders label with correct htmlFor attribute', () => {
  const { getByText } = render(
    <Input
      id="my-input"
      label="My Label"
      name="test"
      value=""
      onChange={() => {}}
    />
  );

  const label = getByText('My Label');
  expect(label.getAttribute('for')).toBe('my-input');
  expect(label.textContent).toBe('My Label');
});

test('renders input with correct props', () => {
  const { getByPlaceholderText } = render(
    <Input
      id="my-input"
      type="email"
      value="test@example.com"
      name="email"
      placeholder="Enter your email"
      disabled={true}
      isRequired={true}
      style={{ backgroundColor: 'red' }}
      isValid={false}
      errorMessage="Invalid email"
      onChange={() => {}}
    />
  );
  const input = getByPlaceholderText('Enter your email');
  expect(input).toHaveAttribute('type', 'email');
  expect(input).toHaveValue('test@example.com');
  expect(input).toHaveAttribute('name', 'email');
  expect(input).toHaveAttribute('placeholder', 'Enter your email');
  expect(input).toBeDisabled();
  expect(input).toBeRequired();
  expect(input).toHaveStyle({ backgroundColor: 'red' });
  expect(input).toHaveAttribute('aria-invalid', 'true');
});
