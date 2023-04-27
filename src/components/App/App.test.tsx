import { render } from '@testing-library/react';
import App from '.';

it('App is not crashing', () => {
  const { container } = render(<App />);

  expect(container).toBeInTheDocument();
});
