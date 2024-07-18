import React, {useEffect, useRef, useState} from "react";
import {all, create, EvalFunction} from 'mathjs';
import "//unpkg.com/mathlive";
import {convertLatexToAsciiMath, MathfieldElement} from "mathlive";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement>;
        }
    }
}

interface Values {
    pn: number;
    fn: number;
    derivada: number;
    error: number | undefined;
}

export default function NewthonRapson() {
    const config = {};
    const math = create(all, config);

    const [originalLaTex, setOriginalLaTex] = useState<string>("");
    const [derivadaLaTex, setDerivadaLaTex] = useState<string>("");
    const [original, setOriginal] = useState<EvalFunction>(new math.ConstantNode(1));
    const [derivada, setDerivada] = useState<EvalFunction>(new math.ConstantNode(1));
    const [pnValue, setPnValue] = useState<string>("");
    const [values, setValues] = useState<Values[]>([]);

    const mf1 = useRef<MathfieldElement | null>(null);

    const ejecutarNewtoRapson = async () => {
        setValues([]);
        const ascciiFunction = convertLatexToAsciiMath(originalLaTex.replace("f\\left(x\\right)=", ""));
        try {
            let originalNode = math.parse(ascciiFunction);
            let derivadaNode = math.derivative(originalNode, 'x');
            setDerivadaLaTex("f^{\\prime}\\left(x\\right)=" + derivadaNode.toTex());
            setOriginal(originalNode.compile());
            setDerivada(derivadaNode.compile());
            let pn = Number.parseInt(pnValue);
            let firstElement: Values = {
                error: undefined,
                pn,
                fn: originalNode.compile().evaluate({x: pn}),
                derivada: derivadaNode.compile().evaluate({x: pn})
            }
            setValues(prevState => [...prevState, firstElement]);
        } catch (error) {
            setDerivadaLaTex("Parser Error");
            console.log(error);
        }
    }

    const calculateNextElement = () => {
        const maxIndex = values.length;
        const prevValues = values[maxIndex - 1];
        const pn = prevValues.pn - (prevValues.fn / prevValues.derivada);
        let newValues: Values = {
            pn,
            fn: original.evaluate({x: pn}),
            derivada: derivada.evaluate({x: pn}),
            error: Math.abs(pn - prevValues.pn)
        }
        if (prevValues.error !== Math.abs(pn - prevValues.pn)) {
            setValues(prevState => [...prevState, newValues]);
        }
    }

    useEffect(() => {
        mf1.current!.mathVirtualKeyboardPolicy = "manual";
        mf1.current!.contentEditable = "false";
        setOriginalLaTex("f\\left(x\\right)=");
    }, []);

    useEffect(() => {
        if (values.length > 0 && (values[0].error === undefined || values[values.length].error !== 0)) {
            setTimeout(calculateNextElement, 1000);
        }
    }, [values]);

    return (
        <div>
            <h1 className="text-3xl font-bold underline text-blue-800">
                Metodo de Newton Rapson
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-10 gap-5">
                <math-field
                    onInput={(evt) => setOriginalLaTex(evt.currentTarget.value)}
                >
                    {originalLaTex}
                </math-field>
                <math-field
                    ref={mf1}
                >
                    {derivadaLaTex}
                </math-field>
                <input
                    value={pnValue}
                    type="number"
                    onInput={(e) => setPnValue(e.currentTarget.value)}
                    className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm border-gray-300"
                    placeholder="Valor inicial de pn"
                />
            </div>
            <div className="my-10 min-w-[100%]">
                <button
                    disabled={(originalLaTex === "f\\left(x\\right)=" || pnValue === "")}
                    className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-blue-700 hover:bg-blue-900 disabled:bg-blue-700/50"
                    onClick={ejecutarNewtoRapson}
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
                    {
                        values.map((value, index) =>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">{index}</td>
                                <td className="border border-gray-300 px-4 py-2">{value.pn}</td>
                                <td className="border border-gray-300 px-4 py-2">{value.fn}</td>
                                <td className="border border-gray-300 px-4 py-2">{value.derivada}</td>
                                <td className="border border-gray-300 px-4 py-2">{value.error!==undefined ? value.error : ""}</td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
}