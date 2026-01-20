import styled from "styled-components";
import logo from "../../../assets/logo-mba.webp"

const HeaderMain = styled.header`
    display: flex;
    box-sizing: border-box;
    width: 100vw;
    min-width: 100vw;
    height: 80px;
    background-color: #333;
    color: #ffffff;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
`

const Header = () => {
    return (
        <HeaderMain>
            <div>
                <span>
                    <p>Trabalho de conclusão de curso - Engenharia de Software</p>
                    <p></p>
                </span>
            </div>
            <div>
                <img 
                src={logo} 
                alt="Logo da USP/Esalq" 
                style={{
                    width: "100px"
                }}
                />
            </div>
        </HeaderMain>
    );
}

export default Header
