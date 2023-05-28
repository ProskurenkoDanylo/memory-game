import { render, fireEvent } from '@testing-library/react';
import Card from './Card';
import fireBorder from '../../assets/images/fire-border.svg';
import defaultCover from '../../assets/images/default-cover.svg';

describe('<Card />', () => {
  const defaultProps = {
    frontIconURL: defaultCover,
    back: 'https://picsum.photos/200/300',
    border: {
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'black',
      borderImageURL: fireBorder,
    },
    opened: false,
    onClick: jest.fn(),
  };

  it('renders without crashing', () => {
    const { getByRole } = render(<Card {...defaultProps} />);
    expect(getByRole('img')).toBeInTheDocument();
  });

  it('displays the correct front icon', () => {
    const { getByRole } = render(<Card {...defaultProps} />);
    expect(getByRole('img')).toHaveAttribute('src', defaultProps.frontIconURL);
  });

  it('displays the correct back image', () => {
    const openedProps = { ...defaultProps, opened: true };
    const { getByTestId } = render(<Card {...openedProps} />);
    expect(getByTestId('card-back-img')).toHaveAttribute(
      'src',
      defaultProps.back
    );
  });

  it('fires onClick event when clicked', () => {
    const { getByTestId } = render(<Card {...defaultProps} />);
    fireEvent.click(getByTestId('card-wrapper'));
    expect(defaultProps.onClick).toHaveBeenCalled();
  });
});
