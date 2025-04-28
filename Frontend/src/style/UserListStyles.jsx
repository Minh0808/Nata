import styled from "styled-components";

export const Background = styled.div`
    padding-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: 100%;
    background-image: url('/images/6057485.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    color: white;
`

export const Menu = styled.div`
    display: flex;
    width: 100%;
    justify-content: end;
    padding-right: 50px;
`

export const Logout = styled.button`
    width: 100px;
    height: 30px;
    border-radius: 5px;
    border: 1px solid black;
    font-size: 16px;

    &:hover {
    background-color: #5d2be6;
    color: black;
    cursor: pointer;
  }
`

export const Infor = styled.div`
    display: flex;
    flex-direction: row;
    gap: 50px;
`

export const Title = styled.h1`
    
`
export const FilterWrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

export const FilterInput = styled.input`
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.3);
  }
`
export const Table = styled.table`
  width: 800px;
  border-collapse: collapse;
`

export const Thead = styled.thead``

export const Tbody = styled.tbody``

export const Tr = styled.tr`
  color: black;
`;

export const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background: #f9f9f9;
  text-align: center;
`

export const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 10px;
  text-align: center;
  color: white;
`

export const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`

export const Add = styled.button`
    border: 1px solid black;
    border-radius: 3px;
    width: 100px;
    height: 30px;

    &:hover {
    background-color: #3105e3;
    color: white;
    cursor: pointer;
  }
`
export const Edit = styled.button`
    border: 1px solid black;
    border-radius: 3px;

    &:hover {
    background-color: #05732a;
    color: white;
    cursor: pointer;
  }
`
export const Delete = styled.button`
    border: 1px solid black;
    border-radius: 3px;

    &:hover {
    background-color: #d31212;
    color: white;
    cursor: pointer;
  }
`

export const Pagination = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
`

export const PageButtons = styled.div`
  display: flex;
  gap: 5px;
`

export const PageButton = styled.button`
  padding: 0.4rem 0.75rem;
`

export const PageSizeSelect = styled.select`
  padding: 0.4rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
`
export const PageList = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`
export const ListUser = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`