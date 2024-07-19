import {createBrowserRouter, RouteObject} from "react-router-dom";

import {lazy} from "react";
import NotFound from "../Views/NotFound.tsx";
import Background from "../Components/Background.tsx";

const NewthonRapson = lazy(()=>import('../Views/NewthonRapson.tsx'))
const Menu = lazy(()=>import('../Views/Menu.tsx'))

export const routes: readonly RouteObject[] = [
    {
        element: <Background/>,
        children:[
            {path:'/', element:<Menu/>, handle:{title:"Algoritmos de Optimización"}},
            {path:'/newton-rapson', element:<NewthonRapson/>, handle:{title:"Algoritmo de Newton Rapson"}}
        ],
        handle: {title: "Algoritmos de Optimización"},
        errorElement:<NotFound/>
    }
];

export const router = createBrowserRouter([...routes]);