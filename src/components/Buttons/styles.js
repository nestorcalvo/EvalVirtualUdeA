import styled, { css } from 'styled-components';

export const Button = styled.button`
  display: flex;
  align-items: center;
  color: ${(props) => props.color || 'white'};
  cursor: pointer;
  border: none;
  border-radius: 20px;
  font-weight: 700;
  padding: 5px 10px;
  background: ${(props) => props.overBackground || '#6c9a06'};
  & svg {
    margin: 4px;
  }
  & :hover {
    background: ${(props) => props.overBackground || '#6c9a06'};
    color: ${(props) => props.colorOver || 'white'};
  }
  ${(props) => {
    !props.canDisplay &&
      css`
        display: none;
      `;
  }}
`;

export const CircleButton = styled.button`
  align-items: center;
  width: ${(props) => props.radius || '40px'};
  height: ${(props) => props.radius || '40px'};
  color: ${(props) => props.color || 'white'};
  font-size: ${(props) => props.size || '20px'};
  cursor: pointer;
  border: none;
  border-radius: 100px;
  font-weight: 700;
  padding: 5px;
  background: ${(props) => props.overBackground || '#6c9a06'};
  & svg {
    margin: 4px;
  }
  & :hover {
    background: ${(props) => props.overBackground || '#6c9a06'};
    color: ${(props) => props.colorOver || 'white'};
  }
  ${(props) => {
  !props.canDisplay &&
  css`
        display: none;
      `;
}}
`;

