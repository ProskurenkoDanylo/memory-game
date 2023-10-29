import styled, { css } from 'styled-components';

export const Suggestion = styled.p`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 25%;
  font-size: 1.75em;
  font-weight: bold;
`;

export const Shadow = styled.div`
  width: 100%;
  height: 100%;
  background-color: transparent;
  transition: box-shadow ease 0.5s;
`;

const agreeDisagreeCommon = css`
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  ${Shadow} {
    position: absolute;
    z-index: 998;
  }
`;

const agreeDisagreeButtonsCommon = css`
  text-align: center;
  color: #fff;
  border: none;
  border-radius: 0.25em;
  padding: 10px 15px;
  min-width: 100px;
`;

export const Agree = styled.div`
  ${agreeDisagreeCommon}
`;

export const AgreeButton = styled.button`
  ${agreeDisagreeButtonsCommon}
  background-color: #10a922;
  align-self: flex-end;
  margin-bottom: 50px;

  &:hover ~ ${Shadow} {
    box-shadow: inset 0px -20px 15px -10px rgba(16, 169, 34, 0.8);
  }
`;

export const Disagree = styled.div`
  ${agreeDisagreeCommon}
`;

export const DisagreeButton = styled.button`
  ${agreeDisagreeButtonsCommon}
  background-color: #e43314;
  align-self: flex-start;
  margin-top: 50px;

  &:hover ~ ${Shadow} {
    box-shadow: inset 0px 20px 15px -10px rgba(228, 51, 20, 0.8);
  }
`;
