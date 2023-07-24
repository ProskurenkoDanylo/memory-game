import React from 'react';
import { Input as InputProps } from './Input.type';
import * as S from './Input.style';

const addClassName = (element: React.ReactElement, className: string) => {
  return React.createElement(element.type, { ...element.props, className });
};

function Input({
  id,
  className,
  type = 'text',
  value,
  name,
  isRequired,
  style,
  label,
  isValid,
  errorMessage,
  startIcon,
  endIcon,
  onChange,
  ...props
}: InputProps) {
  if (label) {
    if (!id) {
      throw Error(
        'Trying to set label without specifiyng an id. Add id to your input component.'
      );
    }
  }

  return (
    <>
      {label ? <S.Label htmlFor={id}>{label}</S.Label> : null}
      <S.InputWrapper>
        {startIcon ? addClassName(startIcon, 'start-icon') : null}
        <S.Input
          id={id}
          className={className}
          type={type}
          name={name}
          value={value}
          style={style}
          required={isRequired}
          valid={isValid}
          onChange={onChange}
          hasStartIcon={startIcon ? true : false}
          hasEndIcon={startIcon ? true : false}
          aria-invalid={typeof isValid === 'boolean' ? !isValid : false}
          {...props}
        />
        {endIcon ? addClassName(endIcon, 'end-icon') : null}
      </S.InputWrapper>
      {!isValid ? <S.ErrorMessage>{errorMessage}</S.ErrorMessage> : null}
    </>
  );
}

export default Input;
