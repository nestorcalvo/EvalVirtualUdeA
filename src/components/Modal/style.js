import styled from 'styled-components'

export const ModalWrapper = styled.div`
 position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const ModalContainer = styled.div`
   position: relative;
    top: 10rem;
    background-color: #333;
    padding: 1rem;
    width: 600px;
    height: 500px;
    border-radius: 20px;
    overflow-y: scroll;
`
export const CloseButton = styled.div`
   position: absolute;
    top: 0;
    right: 0;
    border: 0;
    background-color: #ff7575;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-weight: 600;
`
