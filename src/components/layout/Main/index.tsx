import { Outlet } from "react-router"
import styled from "styled-components"
import Sidebar from "../../Sidebar"

const MainLayout = styled.main`
    display: flex;
    boxsizing: border-box;
    width: 100vw;
    min-height: 720px;
    max-height: 1080px;  
`

const Main = () => {
    return (
        <MainLayout>
            <Sidebar />
            <Outlet />
        </MainLayout>
    )
}

export default Main