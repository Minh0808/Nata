import styled, { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
  }
`

export const Background = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 250px;
    gap: 30px;
    background-image: url('/images/3409297.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    margin: 0;
`

export const Title = styled.div`
    font-size: 35px;
    font-weight: bold;
`

export const FormLogin = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
`
export const ID = styled.div`
    
`

export const PassWord = styled.div`
    
`

export const InputID = styled.input`
    width: 200px;
    height: 23px;
    font-size: 16px;
`

export const InputPassWord = styled.input`
    width: 200px;
    height: 23px;
    font-size: 16px;
`

export const ButtonLogin = styled.button`
    width: 100px;
    height: 30px;
    border-radius: 5px;
    border: 1px solid black;
    font-size: 16px;

    &:hover {
    background-color: aquamarine;
    color: black;
    cursor: pointer;
  }
`