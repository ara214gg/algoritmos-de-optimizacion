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
            {path:'/', element:<Menu/>},
            {path:'/newton-rapson', element:<NewthonRapson/>}
        ],
        handle: {title: "Algoritmos de Optimizacion", requiresLogin: true},
        errorElement:<NotFound/>
    }
];

export const router = createBrowserRouter([...routes], {basename: new URL(document.baseURI).pathname });