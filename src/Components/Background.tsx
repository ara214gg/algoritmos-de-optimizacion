import {Outlet} from "react-router-dom";
import {Suspense, useEffect} from "react";
import Loader from "./Loader.tsx";
import {useRouteMetadata} from "../Router/routing.tsx";

export default function Background() {
    const currentTitle = useRouteMetadata()?.title ?? 'Algoritmos de Optimización';

    useEffect(() => {
        document.title = currentTitle;
    }, [currentTitle]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-100">
            <div className="w-full max-w-screen-xl p-4">
                <Suspense fallback={<Loader/>}>
                    <Outlet/>
                </Suspense>
            </div>
        </div>
    )
}