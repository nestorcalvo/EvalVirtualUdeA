import styled from 'styled-components'

export const WarnMessageWrapper = styled.div`
  width: 300px;
  border-radius: 20px;
  background: ${(props) => props.overBackground || '#DD941B'};
  margin: 0 auto;
`

export const Message = styled.p`
  color: ${(props) => props.color || 'white'};
  padding: 10px 20px;
  text-align: center;
`
