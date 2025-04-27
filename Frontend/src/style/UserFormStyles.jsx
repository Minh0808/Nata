import styled from 'styled-components';

export const Background = styled.div`
    padding-top: 50px;
`

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
`

export const Title = styled.h1`
    text-align: center;
`

export const Infor = styled.div`
    display: flex;
    justify-content: space-between;
`
export const Input = styled.input`
    width: 200px;
    height: 25px;
    font-size: 16px;
`

export const Select = styled.select`
    width: 100%;
    height: 25px;
    font-size: 16px;
`

export const Option = styled.option`

`

export const Button = styled.button`
    width: 80px;
    height: 25px;
    border-radius: 5px;
    border: 1px solid black;

    &:hover {
    background-color: #0e5d81;
    color: white;
    cursor: pointer;
  }
`