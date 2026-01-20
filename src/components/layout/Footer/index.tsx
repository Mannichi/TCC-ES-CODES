import styled from "styled-components"

const FooterMain = styled.footer`
    display: flex;
    box-sizing: border-box;
    width: 100vw;
    height: 50px;
    background-color: #000000;
    color: #ffffff;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    font-size: 12px;
    p{
        margin: 10px;
    }
`

const Footer = () => {
    return (
        <FooterMain>
            <p>Todos os direitos reservados - Diego de Paula</p>
            <p>Copyright © 2025</p>
        </FooterMain>
    )
}

export default Footer
