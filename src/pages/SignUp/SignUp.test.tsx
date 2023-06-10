import { render, fireEvent, screen } from '@testing-library/react';
import SignUp from './SignUp';

describe('SignUp component', () => {
  test('renders without errors', () => {
    render(<SignUp />);
  });

  test('updates username state on input change', () => {
    render(<SignUp />);
    const usernameInput = screen.getByLabelText(
      'Username:'
    ) as HTMLInputElement;
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    expect(usernameInput.value).toBe('testuser');
  });

  test('updates password state on input change', () => {
    render(<SignUp />);
    const passwordInput = screen.getByLabelText(
      'Password:'
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    expect(passwordInput.value).toBe('testpassword');
  });

  test('updates secondPassword state on input change', () => {
    render(<SignUp />);
    const secondPasswordInput = screen.getByLabelText(
      'Confirm Password:'
    ) as HTMLInputElement;
    fireEvent.change(secondPasswordInput, {
      target: { value: 'testpassword' },
    });
    expect(secondPasswordInput.value).toBe('testpassword');
  });

  test('displays username error message for invalid username', () => {
    render(<SignUp />);
    const usernameInput = screen.getByLabelText(
      'Username:'
    ) as HTMLInputElement;
    fireEvent.change(usernameInput, { target: { value: 'us' } });
    const errorMessage = screen.getByText(
      'Username should consist at least 3 characters.'
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test('displays password error message for invalid password', () => {
    render(<SignUp />);
    const passwordInput = screen.getByLabelText(
      'Password:'
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'pass' } });
    const errorMessage = screen.getByText(
      'Password should consist at least 6 characters.'
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test('displays password error message for mismatched passwords', () => {
    render(<SignUp />);
    const passwordInput = screen.getByLabelText(
      'Password:'
    ) as HTMLInputElement;
    const secondPasswordInput = screen.getByLabelText(
      'Confirm Password:'
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    fireEvent.change(secondPasswordInput, {
      target: { value: 'differentpassword' },
    });
    const errorMessage = screen.getByText('Passwords do not match.');
    expect(errorMessage).toBeInTheDocument();
  });
});
