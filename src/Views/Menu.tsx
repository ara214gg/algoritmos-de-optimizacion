import {NavLink} from "react-router-dom";

export default function Menu() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-5">
            <h1 className="text-4xl font-bold text-center mb-10 text-blue-800">Bienvenido al simulador de algoritmos de
                optimizacion</h1>
            <div className="flex space-x-4 mt-10">
                <button
                    className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-blue-700 hover:bg-blue-900">
                    <NavLink to={'/newton-rapson'}>
                        Newton Rapson
                    </NavLink>
                </button>
                <button
                    className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-blue-700 hover:bg-blue-900">
                    <NavLink to={'/gradiente'}>
                    Gradiente Descendente
                    </NavLink>
                </button>
            </div>
        </div>
    );
}