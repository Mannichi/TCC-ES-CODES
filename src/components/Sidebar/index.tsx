import { NavLink } from "react-router"
import styled from "styled-components"

const MenuLateral = styled.aside`
    display: flex;
    boxsizing: border-box;
    flex-direction: column;
    width: 260px
    max-width: 260px;
    min-width: 260px;
    background-color: #444;
    color: #ffffff;
    align-items: start;
    padding: 20px;
`

const Item = styled(NavLink)`
    color: #fff;
    text-decoration: none;
    padding: 10px 0;
    width: 100%;
    &.active {
        font-weight: bold;
        color: #9be8ffff; 
    }
    &:hover {
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
    }
    transition: text-shadow 0.3s ease-in-out;
`

const Sidebar = () => {
    return (
        <MenuLateral>
            <Item to="LeiHick">Lei de Hicks</Item>
            <Item to="Formulario">Fomulário de Etapa vs Único</Item>
            <Item to="Gestalt">Princípio de Gestalt</Item>
            <Item to="PicoFim">Regra Pico e Fim</Item>
        </MenuLateral>
    )
}

export default Sidebar