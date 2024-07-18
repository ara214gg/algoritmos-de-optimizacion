import {Outlet} from "react-router-dom";
import {Suspense} from "react";
import Loader from "./Loader.tsx";

export default function Background() {
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