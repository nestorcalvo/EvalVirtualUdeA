import styled, { css } from 'styled-components';

export const SInput = styled.input`
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin-bottom: 8px;
  padding: 8px 4px;
  display: block;
  width: 100%;
  &[disabled] {
    opacity: 0.3;
  }
  ${(props) =>
    props.error &&
    css`
      border: 2px solid #f27070;
    `};

  ${(props) =>
    props.valid &&
    css`
      border: 2px solid #6c9a06 !important;
    `};
`
export const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
export const InputErrors = styled.div`
  color: #f27070;
  font-size: 0.8em;
  margin-bottom: 10px;
`
