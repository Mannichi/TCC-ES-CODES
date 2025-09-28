import { createBrowserRouter } from "react-router";
import Layout from "../components/layout";
import LeiHicks from "../components/LeiHicks";
import FormEtapaVsUnico from "../components/FormEtapaVsUnico";
import PrincipioGestalt from "../components/PrincipioGestalt";
import Page404 from "../pages/Page404";
import RegraPicoFim from "../components/PicoFim";



export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {index: true},
            {path: "LeiHick", element: <LeiHicks />},
            {path: "Formulario", element: <FormEtapaVsUnico />},
            {path: "Gestalt", element: <PrincipioGestalt />},
            {path: "PicoFim", element: <RegraPicoFim />},
        ]
    },
    {
        path: "*",
        element: <Page404/>,
    }
])