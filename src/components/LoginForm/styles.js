import styled from 'styled-components';

export const FormWrapper = styled.div`
  padding: 16px 0;
  max-width: 350px;
  width: 100%;
  margin: 0 auto;
`
export const LoginButton = styled.button`
  background: #6c9a06;
  border-radius: 3px;
  color: #fff;
  height: 32px;
  width: 100%;
  text-align: center;
  border: none;
  cursor: pointer;
  &[disabled] {
    opacity: 0.3;
  }
`
export const Title = styled.h2`
  font-size: 16px;
  font-weight: 500;
  padding: 8px 0;
  color: white;
  text-align: center;
`;
export const LoginError = styled.div`
  font-size: 0.8em;
    color: white;
    position: absolute;
    background: #f15a5a;
    padding: 10px 20px;
    text-align: center;
    margin-top: 10px;
    width: 350px;
`

export const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-size: 0.8em;
   color: #ececec;
  font-style: italic;
`
