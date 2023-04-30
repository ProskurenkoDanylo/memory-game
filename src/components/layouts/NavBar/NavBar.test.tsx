import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from '.';

it('NavBar renders and display correctly', () => {
  const { getByLabelText, container } = render(
    <BrowserRouter>
      <NavBar />
    </BrowserRouter>
  );

  expect(container).toBeInTheDocument();
  expect(getByLabelText('Home')).toHaveStyle('color: #fff');
});
