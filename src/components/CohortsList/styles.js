import styled from 'styled-components'
import { Link as Linkrouter } from 'react-router-dom'

export const List = styled.div`
    padding: 10px;
    margin-bottom: 20px;
    border-bottom: solid 1px #fff;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`
export const ListItem = styled(Linkrouter)`
    width: 100%;
    margin-bottom: 10px;
    background: #757d61;
    padding: 15px;
    color: white;
    border-radius: 15px;
    cursor: pointer;
    text-decoration: none;
`

export const ListItemHeader = styled.div`
    width: 100%;
`
export const ListItemTitle = styled.h3`
    font-size: 1.1em;
`
export const ListItemContent = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`
export const ListItemSubtitle = styled.p`
    font-size: 0.8em;
`
