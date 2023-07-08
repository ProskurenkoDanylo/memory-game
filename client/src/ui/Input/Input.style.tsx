import styled from 'styled-components';

interface StyledInputProps {
  valid?: boolean | string;
  hasStartIcon?: boolean;
  hasEndIcon?: boolean;
}

export const InputWrapper = styled.div`
  position: relative;

  img,
  svg,
  i {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    &:first-child {
      left: 12px;
    }
    &:last-child {
      right: 12px;
    }
  }
`;

export const Input = styled.input`
  display: block;
  width: 100%;
  background-color: transparent;
  border: 2px solid #fff;
  color: #fff;
  padding: 10px
    ${({ hasEndIcon }: StyledInputProps) => (hasEndIcon ? '40px' : '20px')} 10px
    ${({ hasStartIcon }: StyledInputProps) => (hasStartIcon ? '40px' : '20px')};
  font-family: 'Montserrat', sans-serif;

  &::placeholder {
    color: #868686;
  }

  &:hover {
    border-color: #55a4e6;
  }

  &:focus-visible {
    outline: none;
    border-color: #1589e7;
  }

  &:disabled {
    pointer-events: none;
    border: 2px solid #868686;
    background-color: rgba(134, 134, 134, 0.05);
  }

  &:autofill {
    border-color: #55a4e6;
  }

  ${({ valid }: StyledInputProps) =>
    valid === false &&
    `
    border: 2px solid #E65555;

    &:hover {
      border-color: #E65555;
    }

    &:focus-visible {
      outline: none;
      border-color: #e24545;
    }
  `}
`;

export const Label = styled.label`
  display: block;
  margin: 10px 0;
  pointer-events: none;
`;

export const ErrorMessage = styled.p`
  margin: 10px 0;
  font-size: 0.75em;
  color: #e65555;
`;
