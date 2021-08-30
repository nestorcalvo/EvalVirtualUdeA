import styled, { css } from 'styled-components'

export const BarraDrag = styled.div`
width: 100%;
height: 20px;
-webkit-app-region: drag;
background: #616161;
z-index: 300;
cursor: pointer;
`

export const Logout = styled.div`
  font-size: 0.8em;
  color: white;
  background: #dd1b2b;
  width: 100%;
  padding: 10px 20px;
  text-align: center;
  cursor: pointer;
`
export const Camera = styled.div`
    width: 100%;
    height: auto; 
    display: flex;
    flex-direction: column;
`

export const CameraContainer = styled.div`
display: flex;
height: 200px; 
`

export const CameraButton = styled.div`
    background-color: #6c9a06;
    cursor: pointer;
    padding: 0.5rem 1rem;
    color: white;
    transition: 0.4s all;
    z-index: 3000;
    &:hover{
      background-color: #587518;
    }
    
  `
export const ConfirmButton = styled.div`
  background: #6c9a06;
  cursor: pointer;
  padding: 10px 15px;
  color: white;
  width: 45%;
  font-size: 0.8em;
  font-weight: 550;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  ${props => props.repeat && css`
    background: #c37627;
  `}
`

export const CameraActions = styled.div`
    width: 100%;
    text-align: center;
    z-index: 3000;
  `
export const SnapshotPreview = styled.img`
    width: 100%;
    height: auto;
    display: table;
    position: absolute;
    top: 0;
    z-index: 3;
`
export const Error = styled.div`
  font-size: 0.8em;
    color: white;
    background: #f15a5a;
    width: 100%;
    padding: 10px 20px;
    text-align: center;
`
export const LoadingZoneWrapper = styled.div`
  text-align: center;
  position: relative;
`
export const LoadingZoneContent = styled.div`
  text-align: center;
  right: 0;
  left: 0;
  margin: auto;
`
export const BackgroundCamera = styled.div`
  background: white;
  width: 350px,
  height: 200px;
`
export const ConfirmRepeatContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
`
export const CameraButtonWrapper = styled.div`
  margin-top: 20px;
`
