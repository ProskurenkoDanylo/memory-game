import { render, fireEvent, screen } from '@testing-library/react';
import SignIn from './SignIn';

describe('SignIn component', () => {
  test('renders without errors', () => {
    render(<SignIn />);
  });

  test('updates username state on input change', () => {
    render(<SignIn />);
    const usernameInput = screen.getByLabelText(
      'Username:'
    ) as HTMLInputElement;
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    expect(usernameInput.value).toBe('testuser');
  });

  test('updates password state on input change', () => {
    render(<SignIn />);
    const passwordInput = screen.getByLabelText(
      'Password:'
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    expect(passwordInput.value).toBe('testpassword');
  });

  test('displays username error message for invalid username', () => {
    render(<SignIn />);
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
    render(<SignIn />);
    const passwordInput = screen.getByLabelText(
      'Password:'
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'pass' } });
    const errorMessage = screen.getByText(
      'Password should consist at least 6 characters.'
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test('calls the login function when the login button is clicked', () => {
    render(<SignIn />);
    const loginButton = screen.getByText('Login');
    const loginMock = jest.fn();
    loginButton.onclick = loginMock;
    fireEvent.click(loginButton);
    expect(loginMock).toHaveBeenCalledTimes(1);
  });
});
