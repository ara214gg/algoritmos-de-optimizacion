import {useEffect, useState} from "react";
import {all, create} from 'mathjs';
import "//unpkg.com/mathlive";
import {convertLatexToAsciiMath} from "mathlive";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathMLElement>, MathMLElement>;
        }
    }
}

export default function NewthonRapson() {
    const [value, setValue] = useState<string>("");
    const config = {}
    const math = create(all, config)
    useEffect(() => {
        let node = math.parse('f(x)=x^4+x^2+3+sin (x)');
        console.log("Normal String " + node.toString());
        console.log("LaTex String " + node.toTex());
        let nodeDerivado = math.derivative(node,'x');
        console.log("Derivada String" + nodeDerivado.toString());
        console.log("Derivada LaTex" + nodeDerivado.toTex());
    }, []);
    const parse = () => {
        console.log(convertLatexToAsciiMath(value));
    }
    return (
        <div>
            <h1 className="text-3xl font-bold underline text-blue-800">
                Metodo de Newton Rapson
            </h1>
            <math-field
                onInput={(evt:React.ChangeEvent<HTMLInputElement>) => setValue(evt.target.value)}
            >
                {value}
            </math-field>
            <button onClick={parse}>parse</button>
        </div>
    );
}