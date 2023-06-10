import { render } from '@testing-library/react';
import Text from './Text';

describe('Text component', () => {
  it('renders without error', () => {
    render(<Text>Test Text</Text>);
  });

  it('displays the correct text', () => {
    const { getByText } = render(<Text>Test Text</Text>);
    const textElement = getByText('Test Text');
    expect(textElement).toBeInTheDocument();
  });

  it('applies the specified alignment', () => {
    const { container } = render(<Text alignment="right">Test Text</Text>);
    expect(container.firstChild).toHaveStyle('text-align: right');
  });

  it('applies the specified color', () => {
    const { container } = render(<Text color="#ff0000">Test Text</Text>);
    expect(container.firstChild).toHaveStyle('color: #ff0000');
  });

  it('applies the specified font weight', () => {
    const { container } = render(<Text fontWeight="bold">Test Text</Text>);
    expect(container.firstChild).toHaveStyle('font-weight: bold');
  });

  it('applies additional custom styles', () => {
    const customStyle = {
      backgroundColor: '#000',
      fontSize: '16px',
    };
    const { container } = render(<Text style={customStyle}>Test Text</Text>);
    expect(container.firstChild).toHaveStyle('background-color: #000');
    expect(container.firstChild).toHaveStyle('font-size: 16px');
  });
});
