import { render } from '@testing-library/react';
import Container from '.';

it('Container render its children', () => {
  const { queryByText } = render(
    <Container>Renders children successfully.</Container>
  );

  expect(queryByText(/children/i)).toBeTruthy();
});
