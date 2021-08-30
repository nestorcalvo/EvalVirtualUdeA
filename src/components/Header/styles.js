import styled from 'styled-components'
import { FaAngleLeft } from 'react-icons/all'

export const HeaderWrapper = styled.div`
    padding: 10px;
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
    border-bottom: solid 1px #fff;
    width: 100%;
`
export const HeaderItem = styled.p`
    margin: 0 0 0 10px;
    padding: 0;
    display: inline-block;
    font-size: 0.8em;
`

export const LogoutButton = styled.p`
    margin: 0 0 0 10px;
    padding: 0;
    display: flex;
    font-size: 0.8em;
    color: #dd941b;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    :hover{
      color:#e8bb6f;
      filter: drop-shadow(1px 1px 8px);
    }
`

export const BackButton = styled(FaAngleLeft)`
margin-right: auto;
color: #dd941b;
padding-left: 5px;
font-size: 1.1em;
cursor: pointer;
:hover{
      color:#e8bb6f;
      filter: drop-shadow(1px 1px 8px);
    }
`
