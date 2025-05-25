import styled from "styled-components";

export const ContainerCentered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 20px;
  height: 100%;
`;

export const ContainerFlex = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
`


export const LoginBox = styled.div`
  width: 360px;
  background-color: #f5f5f5;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const ScrollContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: #fff;
  padding: 20px;
  overflow-y: auto;
`;

export const HeaderPageContainer = styled.div`
  display: flex; 
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`
export const InputDiv = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 12px;
  height: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  gap: 8px;
`;