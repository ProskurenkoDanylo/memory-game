import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '.';

it('App is not crashing', () => {
  const { container } = render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  expect(container).toBeInTheDocument();
});
