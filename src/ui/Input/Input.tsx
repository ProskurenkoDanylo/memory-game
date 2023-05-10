import { Input as InputProps } from './Input.type';
import * as S from './Input.style';

function Input({
  id,
  className,
  type = 'text',
  value,
  name,
  placeholder,
  disabled,
  isRequired,
  style,
  autoFocus,
  label,
  isValid,
  errorMessage,
  startIcon,
  endIcon,
  onChange,
  onBlur,
  onFocus,
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
        {startIcon}
        <S.Input
          id={id}
          className={className}
          type={type}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          style={style}
          required={isRequired}
          autoFocus={autoFocus}
          valid={isValid}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          hasStartIcon={startIcon ? true : false}
          hasEndIcon={startIcon ? true : false}
          aria-invalid={!isValid}
        />
        {endIcon}
      </S.InputWrapper>
      {!isValid ? <S.ErrorMessage>{errorMessage}</S.ErrorMessage> : null}
    </>
  );
}

export default Input;
