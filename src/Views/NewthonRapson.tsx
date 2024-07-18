import React, {useEffect, useRef, useState} from "react";
import {all, create} from 'mathjs';
import "//unpkg.com/mathlive";
import {convertLatexToAsciiMath, MathfieldElement} from "mathlive";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement>;
        }
    }
}

export default function NewthonRapson() {
    const [originalFunction, setOriginalFunction] = useState<string>("");
    const [derivada, setDerivada] = useState("");

    const config = {};
    const math = create(all, config);
    const mf1 = useRef<MathfieldElement | null>(null);

    useEffect(() => {
        mf1.current!.mathVirtualKeyboardPolicy = "manual";
        mf1.current!.contentEditable = "false";
        setOriginalFunction("f\\left(x\\right)=");
    }, []);

    const parse = () => {
        console.log(convertLatexToAsciiMath(originalFunction));
        const ascciiFunction = convertLatexToAsciiMath(originalFunction);
        let nodeFunction = math.parse(ascciiFunction);
        let nodeDerivado = math.derivative(nodeFunction, 'x');
        console.log("String: " + nodeDerivado.toString());
        console.log("Latex: " + nodeDerivado.toTex());
        setDerivada("f^{\\prime}\\left(x\\right)=" + nodeDerivado.toTex());
    }

    return (
        <div>
            <h1 className="text-3xl font-bold underline text-blue-800">
                Metodo de Newton Rapson
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 my-10 gap-10">
                <math-field
                    onInput={(evt) => setOriginalFunction(evt.currentTarget.value)}
                >
                    {originalFunction}
                </math-field>
                <math-field
                    ref={mf1}
                >
                    {derivada}
                </math-field>
            </div>
            <div className="my-10 min-w-[100%]">
                <button
                    className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-blue-700 hover:bg-blue-900"
                    onClick={parse}
                >
                    Ejecutar
                </button>
            </div>
            <div className="overflow-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="text-blue-100">
                    <tr className="bg-blue-800">
                        <th className="border border-gray-300 px-4 py-2">n</th>
                        <th className="border border-gray-300 px-4 py-2">pn</th>
                        <th className="border border-gray-300 px-4 py-2">f(p)</th>
                        <th className="border border-gray-300 px-4 py-2">f'(p)</th>
                        <th className="border border-gray-300 px-4 py-2">error</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">0</td>
                        <td className="border border-gray-300 px-4 py-2">1.000000</td>
                        <td className="border border-gray-300 px-4 py-2">-0.158529</td>
                        <td className="border border-gray-300 px-4 py-2">1.381773</td>
                        <td className="border border-gray-300 px-4 py-2"></td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">0</td>
                        <td className="border border-gray-300 px-4 py-2">1.000000</td>
                        <td className="border border-gray-300 px-4 py-2">-0.158529</td>
                        <td className="border border-gray-300 px-4 py-2">1.381773</td>
                        <td className="border border-gray-300 px-4 py-2"></td>
                    </tr>
                    {/* Add other rows here */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}