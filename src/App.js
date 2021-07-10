import React, { useState, useEffect, useRef } from "react";

function App() {
  const [input, setInput] = useState("0");
  const [output, setOutput] = useState(0);
  const [store, setStore] = useState([]);
  const [result, setResult] = useState(false);
  const [error, setError] = useState(false);
  const [blink, setBlink] = useState(true);

  const clear = () => {
    console.clear();
    setInput("0");
    setOutput(0);
    setStore([]);
    setResult(false);
    setBlink(true);
  };

  const backspace = () =>
    /\s$/.test(input)
      ? setInput((ps) => ps.slice(0, ps.length - 3))
      : input.length > 1
      ? setInput((ps) => ps.slice(0, ps.length - 1))
      : clear();

  const goBack = () => {
    if (store.length > 0) {
      setInput(store[store.length - 1].input);
      setOutput(store[store.length - 1].output);
      return setStore((ps) => ps.slice(0, ps.length - 1));
    } else return clear();
  };

  // calculate using map of functions and switch conditional
  const calc = (key) => {
    const regexOperator = /[/*\-+]/;
    const operators = {
      "+": (a, b) => a + b,
      "-": (a, b) => a - b,
      "*": (a, b) => a * b,
      "/": (a, b) => a / b,
    };
    const count = (str) => {
      let arr = str.split(" ").map((a) => (/\d+/.test(a) ? +a : a));
      let val = arr[0];
      let newArr = arr.slice(1);
      while (/[+\-*/]/.test(newArr[0])) {
        val = operators[newArr[0]](val, newArr[1]);
        newArr.splice(0, 2);
      }
      return val;
    };
    switch (key) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        if (!/\s0\d|^0{2,}/.test(input + key))
          setInput((ps) => (/^0\d/.test(input + key) ? key : ps + key));
        break;
      case ".":
        setInput((ps) => (!/\d+\.\d*$|\s$/.test(input) ? ps + "." : ps));
        break;
      case "/":
      case "*":
      case "-":
      case "+":
        if (!/^-$/.test(input))
          setInput((ps) =>
            !/[/*\-+]\s-?$|\d\.$/.test(input) ? (ps += ` ${key} `) : ps
          );
        if (/\s$/.test(input) && key === "-") setInput((ps) => ps + key);
        else if (input === "0" && key === "-") setInput(key);
        break;
      case "=":
        if (/^0\s\/|Infinity\s\//.test(input)) setError(true);
        else if (/[\d.]$/.test(input)) {
          result === true &&
            // output !== Infinity &&
            setInput(
              input.replace(/^-?\d+\.?\d*(e[+-])?\d*(?=\s)/, String(output))
            );
          setOutput((ps) =>
            result === true && regexOperator.test(input)
              ? count(input.replace(/^-?\d+\.?\d*(e[+-])?\d*(?=\s)/, ps))
              : count(input)
          );
          result === true &&
            setStore((ps) =>
              ps.length !== 0 && input.split(" ")[0] === String(output)
                ? ps
                : [...ps, { input, output }]
            );
          if (regexOperator.test(input)) setResult(true);
        } else setError(true);
        break;
      case "shift":
        return null;
      default:
        return setError(true);
    }
  };

  const handleClick = (e) => calc(e.target.innerHTML);

  const onKeyDown = (e) => {
    const key = e.key.toLowerCase();
    switch (key) {
      case "backspace":
        return backspace();
      case "delete":
      case "c":
      case "с":
        return clear();
      case "b":
        return goBack();
      default:
        return calc(key);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [input, output, result, onKeyDown]);

  useEffect(() => setError(false), [input, output]);

  const reverseStr = (str) =>
    str === "" ? "" : reverseStr(str.substr(1)) + str.charAt(0);

  const addSpaces = (num) => {
    let str =
      typeof num === "string"
        ? num.replace(/-?\d+(\.\d+e[+-]\d+)?(\.\d+)?/g, (a) => parseFloat(a))
        : String(num);
    let rev = reverseStr(str);
    const replacer = (match) => match.replace(/\s/g, "");
    return /\d{4,}/.test(str)
      ? reverseStr(
          rev
            .replace(/(\d{3}(?![+-]e)-?)/g, "$1 ")
            .replace(
              /((\d+)\s?)+?(\d+)?\s(\d+)?(?=\.\d+|\.(\d+\s?)+)/g,
              replacer
            )
            .replace(/\s$/, "")
        )
      : str;
  };

  const blinkRef = useRef(false);

  useEffect(
    () => (blinkRef.current ? setBlink(false) : (blinkRef.current = true)),
    [input]
  );

  useEffect(() => console.log(input), [input])

  return (
    <div className="flex flex-col items-center" id="main">
      <div
        className="flex flex-col m-6 border-2 
        select-none font-sans text-lg rounded-lg w-11/12 xs:w-5/6 sm:w-96"
        id="calc"
      >
        <div
          className="flex flex-col items-end px-4 py-8 font-monospace text-4xl break-all"
          id="display"
        >
          <p className={blink ? "blink pb-2" : "pb-2"}>
            {input === "0" && result === false ? "_" : addSpaces(input)}
          </p>
          <p className="border-t pt-2">
            {
              result === true &&
                // addSpaces(output)
                addSpaces(output.toFixed(4))
              // addSpaces(Math.round(output * 1e4) / 1e4)
            }
          </p>
        </div>
        <div className="controlpad grid gap-2 grid-cols-3 px-4">
          <div
            className="p-2 text-2xl font-thin bg-red-700 bg-opacity-20 hover:bg-opacity-50 active:-mb-0.5 active:shadow active:mt-0.5 border flex justify-center items-center col-span-2"
            id="clear"
            onClick={clear}
          >
            C
          </div>
          <div
            className="p-2 text-2xl font-thin bg-gray-200 hover:bg-gray-300 active:-mb-0.5 active:shadow active:mt-0.5 border flex justify-center items-center"
            id="backspace"
            onClick={backspace}
          >
            ←
          </div>
          <div
            className="oper p-2 text-2xl font-thin bg-gray-200 hover:bg-gray-300 active:-mb-0.5 active:shadow active:mt-0.5 border flex justify-center items-center"
            id="add"
            onClick={handleClick}
          >
            +
          </div>
          <div
            className="oper p-2 text-2xl font-thin bg-gray-200 hover:bg-gray-300 active:-mb-0.5 active:shadow active:mt-0.5 border flex justify-center items-center"
            id="multiply"
            onClick={handleClick}
          >
            *
          </div>
          <div
            className="oper p-2 text-2xl font-thin bg-gray-200 hover:bg-gray-300 active:-mb-0.5 active:shadow active:mt-0.5 border flex justify-center items-center col-start-1"
            id="substract"
            onClick={handleClick}
          >
            -
          </div>
          <div
            className="oper p-2 text-2xl font-thin bg-gray-200 hover:bg-gray-300 active:-mb-0.5 active:shadow active:mt-0.5 border flex justify-center items-center col-start-2"
            id="divide"
            onClick={handleClick}
          >
            /
          </div>
          <div
            className="p-2 text-2xl font-thin bg-gray-200 hover:bg-gray-300 active:-mb-0.5 active:shadow active:mt-0.5 border flex justify-center items-center row-start-2 col-start-3 row-span-2"
            id="equals"
            onClick={handleClick}
          >
            =
          </div>
        </div>
        <div className="px-4 grid gap-2 grid-cols-3 pt-2 pb-12" id="numpad">
          <div
            className="num flex justify-center items-center bg-gray-100 hover:bg-gray-300 border text-3xl font-normal"
            id="nine"
            onClick={handleClick}
          >
            9
          </div>
          <div
            className="num flex justify-center items-center bg-gray-100 hover:bg-gray-300 active:-mb-0.5 active:shadow active:mt-0.5 h-16 border text-3xl font-normal"
            id="eight"
            onClick={handleClick}
          >
            8
          </div>
          <div
            className="num flex justify-center items-center bg-gray-100 hover:bg-gray-300 active:-mb-0.5 active:shadow active:mt-0.5 h-16 border text-3xl font-normal"
            id="seven"
            onClick={handleClick}
          >
            7
          </div>
          <div
            className="num flex justify-center items-center bg-gray-100 hover:bg-gray-300 active:-mb-0.5 active:shadow active:mt-0.5 h-16 border text-3xl font-normal"
            id="six"
            onClick={handleClick}
          >
            6
          </div>
          <div
            className="num flex justify-center items-center bg-gray-100 hover:bg-gray-300 active:-mb-0.5 active:shadow active:mt-0.5 h-16 border text-3xl font-normal"
            id="five"
            onClick={handleClick}
          >
            5
          </div>
          <div
            className="num flex justify-center items-center bg-gray-100 hover:bg-gray-300 active:-mb-0.5 active:shadow active:mt-0.5 h-16 border text-3xl font-normal"
            id="four"
            onClick={handleClick}
          >
            4
          </div>
          <div
            className="num flex justify-center items-center bg-gray-100 hover:bg-gray-300 active:-mb-0.5 active:shadow active:mt-0.5 h-16 border text-3xl font-normal"
            id="three"
            onClick={handleClick}
          >
            3
          </div>
          <div
            className="num flex justify-center items-center bg-gray-100 hover:bg-gray-300 active:-mb-0.5 active:shadow active:mt-0.5 h-16 border text-3xl font-normal"
            id="two"
            onClick={handleClick}
          >
            2
          </div>
          <div
            className="num flex justify-center items-center bg-gray-100 hover:bg-gray-300 active:-mb-0.5 active:shadow active:mt-0.5 h-16 border text-3xl font-normal"
            id="one"
            onClick={handleClick}
          >
            1
          </div>
          <div
            className="p-2 text-2xl font-thin bg-gray-200 hover:bg-gray-300 active:-mb-0.5 active:shadow active:mt-0.5 border flex justify-center items-center"
            id="go_back"
            onClick={goBack}
          >
            Back
          </div>
          <div
            className="num flex justify-center items-center bg-gray-100 hover:bg-gray-300 active:-mb-0.5 active:shadow active:mt-0.5 h-16 border text-3xl font-normal col-start-2"
            id="zero"
            onClick={handleClick}
          >
            0
          </div>
          <div
            className="p-2 text-2xl font-thin bg-gray-100 hover:bg-gray-200 active:-mb-0.5 active:shadow active:mt-0.5 border flex justify-center items-center"
            id="decimal"
            onClick={handleClick}
          >
            .
          </div>
        </div>
      </div>
      <p className="flex justify-center align-center">{error && "Error!!1"}</p>
    </div>
  );
}

export default App;
