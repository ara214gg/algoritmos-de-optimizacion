import React, { useEffect, useRef, useState } from "react";
import { all, create } from "mathjs";
import "//unpkg.com/mathlive";
import { convertLatexToAsciiMath, MathfieldElement } from "mathlive";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement>,
        MathfieldElement
      >;
    }
  }
}

interface IterationData {
  n: number;
  valueX: string;
  valueY: string;
  evaluarFX: string;
  evaluarDerivadaX: string;
  evaluarDerivadaY: string;
  evaluarSegundaDerivadaX: string;
  evaluarPrimeraDerivadaMixtaXY: string;
  evaluarPrimeraDerivadaMixtaYX: string;
  evaluarSegundaDerivadaY: string;
  normaGradiente: string;
  denominadorAlpha: string;
  alpha: string;
  convergencia: string;
  valorComparado: string;
}

export default function Gradiente() {
  const config = {};
  const math = create(all, config);

  const [equationLatex, setEquationLatex] = useState<string>("");
  const [iterations, setIterations] = useState<IterationData[]>([]);
  const [criterioConvergencia, setCriterioConvergencia] = useState<string>("");

  const mf1 = useRef<MathfieldElement | null>(null);

  const calcularDerivadas = async () => {
    const asciiFunction = convertLatexToAsciiMath(equationLatex);
    const newIterations: IterationData[] = [];
    let currentX = 0.1; // Valor inicial de X
    let currentY = 0.1; // Valor inicial de Y
    let convergenciaReached = false;
    let iterCount = 0;

    while (!convergenciaReached && iterCount < 10) {
      try {
        iterCount += 1;
        const originalNode = math.parse(asciiFunction);
        const derivadaXNode = math.derivative(originalNode, "x");
        const derivadaYNode = math.derivative(originalNode, "y");

        // Evaluar F(x)
        const evalFx = math.evaluate(asciiFunction, {
          x: currentX,
          y: currentY,
        });

        // Evaluación de las primeras derivadas
        const evalDerivadaX = parseFloat(
          derivadaXNode.evaluate({ x: currentX, y: currentY }).toFixed(12)
        );
        const evalDerivadaY = parseFloat(
          derivadaYNode.evaluate({ x: currentX, y: currentY }).toFixed(12)
        );

        // Segunda derivadas y derivadas mixtas
        const segundaDerivadaXNode = math.derivative(derivadaXNode, "x");
        const segundaDerivadaYNode = math.derivative(derivadaYNode, "y");
        const derivadaMixtaXYNode = math.derivative(derivadaXNode, "y");
        const derivadaMixtaYXNode = math.derivative(derivadaYNode, "x");

        const evalSegundaDerivadaX = segundaDerivadaXNode
          .evaluate({
            x: currentX,
            y: currentY,
          })
          .toFixed(12);
        const evalSegundaDerivadaY = segundaDerivadaYNode
          .evaluate({
            x: currentX,
            y: currentY,
          })
          .toFixed(12);
        const evalDerivadaMixtaXY = derivadaMixtaXYNode
          .evaluate({
            x: currentX,
            y: currentY,
          })
          .toFixed(12);
        const evalDerivadaMixtaYX = derivadaMixtaYXNode
          .evaluate({
            x: currentX,
            y: currentY,
          })
          .toFixed(12);

        // ||∇f||²
        const normaGradienteCalculada =
          Math.pow(evalDerivadaX, 2) + Math.pow(evalDerivadaY, 2);
        const normaGradiente = normaGradienteCalculada.toFixed(12);
        const valorComparado = Math.sqrt(normaGradienteCalculada).toFixed(12);

        // Denominador de α
        const hessianaMatrix = [
          [parseFloat(evalSegundaDerivadaX), parseFloat(evalDerivadaMixtaXY)],
          [parseFloat(evalDerivadaMixtaYX), parseFloat(evalSegundaDerivadaY)],
        ];
        const gradienteVector = [evalDerivadaX, evalDerivadaY];

        const hessianaPorGradiente = math.multiply(
          hessianaMatrix,
          gradienteVector
        );
        const denomAlfaCalculado = math.multiply(
          math.transpose(gradienteVector),
          hessianaPorGradiente
        );
        const denominadorAlpha = denomAlfaCalculado.toFixed(12);

        // α = ||∇f||² / Denom. α
        const alpha = (normaGradienteCalculada / denomAlfaCalculado).toFixed(
          12
        );

        // Verificar convergencia
        const converge =
          criterioConvergencia &&
          parseFloat(valorComparado) <= parseFloat(criterioConvergencia)
            ? "Stop"
            : "Continue";
        if (converge === "Stop") convergenciaReached = true;

        // Guardar los datos de la iteración
        newIterations.push({
          n: newIterations.length + 1,
          valueX: currentX.toFixed(12),
          valueY: currentY.toFixed(12),
          evaluarFX: evalFx.toFixed(12),
          evaluarDerivadaX: evalDerivadaX.toString(),
          evaluarDerivadaY: evalDerivadaY.toString(),
          evaluarSegundaDerivadaX: evalSegundaDerivadaX,
          evaluarPrimeraDerivadaMixtaXY: evalDerivadaMixtaXY,
          evaluarPrimeraDerivadaMixtaYX: evalDerivadaMixtaYX,
          evaluarSegundaDerivadaY: evalSegundaDerivadaY,
          normaGradiente,
          denominadorAlpha,
          alpha,
          convergencia: converge,
          valorComparado,
        });

        // Calcular los nuevos X y Y para la siguiente iteración
        currentX = currentX + parseFloat(alpha) * -evalDerivadaX;
        currentY = currentY + parseFloat(alpha) * -evalDerivadaY;
      } catch (error) {
        console.error("Error en el cálculo de derivadas: ", error);
        break;
      }
    }

    // Guardar todas las iteraciones en el estado
    setIterations(newIterations);
  };

  const resetValues = () => {
    setEquationLatex("");
    setIterations([]);
    setCriterioConvergencia("");
  };

  useEffect(() => {
    if (mf1.current) {
      mf1.current.mathVirtualKeyboardPolicy = "manual";
      mf1.current.contentEditable = "false";
      setEquationLatex("");
    }
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold underline text-blue-800">
        Metodo del Gradiente descendente
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 my-10 gap-5">
        <div>
          <label className="block text-gray-700">
            Criterio de convergencia:
          </label>
          <math-field
            onInput={(evt) => setCriterioConvergencia(evt.currentTarget.value)}
          ></math-field>
        </div>
        <div>
          <label className="block text-gray-700">f(x): </label>
          <math-field
            onInput={(evt) => setEquationLatex(evt.currentTarget.value)}
          >
            {equationLatex}
          </math-field>
        </div>
      </div>

      <div className="my-5 min-w-[100%]">
        <button
          disabled={equationLatex === ""}
          className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-blue-700 hover:bg-blue-900 disabled:bg-blue-700/50"
          onClick={calcularDerivadas}
        >
          Calcular Derivadas
        </button>

        <button
          className="py-2 px-4 ml-4 font-semibold rounded-lg shadow-md text-white bg-red-700 hover:bg-red-900"
          onClick={resetValues}
        >
          Reset
        </button>
      </div>

      <div className="overflow-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="text-blue-100">
            <tr className="bg-blue-800">
              <th className="border border-gray-300 px-4 py-2">n</th>
              <th className="border border-gray-300 px-4 py-2">(X,Y)</th>
              <th className="border border-gray-300 px-4 py-2">f(x)</th>
              <th className="border border-gray-300 px-4 py-2">∇f</th>
              <th className="border border-gray-300 px-4 py-2" colSpan={2}>
                Hf
              </th>
              <th className="border border-gray-300 px-4 py-2">||∇f||²</th>
              <th className="border border-gray-300 px-4 py-2">Denom α</th>
              <th className="border border-gray-300 px-4 py-2">α</th>
              <th className="border border-gray-300 px-4 py-2">
                Valor Comparado
              </th>
              <th className="border border-gray-300 px-4 py-2">Convergencia</th>
            </tr>
          </thead>
          <tbody>
            {iterations.map((iter) => (
              <tr key={iter.n}>
                <td className="border border-gray-300 px-4 py-2">{iter.n}</td>
                <td className="border border-gray-300 px-4 py-2">
                  ({parseFloat(iter.valueX).toFixed(3)},{" "}
                  {parseFloat(iter.valueY).toFixed(3)})
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {parseFloat(iter.evaluarFX).toFixed(3)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ({parseFloat(iter.evaluarDerivadaX).toFixed(3)},{" "}
                  {parseFloat(iter.evaluarDerivadaY).toFixed(3)})
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ({parseFloat(iter.evaluarSegundaDerivadaX).toFixed(3)},{" "}
                  {parseFloat(iter.evaluarPrimeraDerivadaMixtaXY).toFixed(3)})
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ({parseFloat(iter.evaluarPrimeraDerivadaMixtaYX).toFixed(3)},{" "}
                  {parseFloat(iter.evaluarSegundaDerivadaY).toFixed(3)})
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {parseFloat(iter.normaGradiente).toFixed(3)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {parseFloat(iter.denominadorAlpha).toFixed(3)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {parseFloat(iter.alpha).toFixed(3)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {parseFloat(iter.valorComparado).toFixed(10)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {iter.convergencia}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
