import { useRef, useEffect, useState } from "react";
import "./calculator.css";
import { btns, BTN_ACTIONS } from "./BtnConfig";

const Calculator = () => {
  const btnsRef = useRef(null);
  const expRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);
  const [expression, setExpression] = useState("");

  useEffect(() => {
    const btns = Array.from(btnsRef.current.querySelectorAll("button"));
    btns.forEach((e) => (e.style.height = e.offsetWidth + "px"));
  }, []);

  const btnClick = (item) => {
    const expDiv = expRef.current;

    if (item.action === BTN_ACTIONS.THEME) {
      document.body.classList.toggle("dark");
      setDarkMode((prevDarkMode) => !prevDarkMode);
      const themeButton = btnsRef.current.querySelector(`.${"btn__th"}`);
      themeButton.innerHTML = darkMode ? "☀️" : "🌙";
      return;
    }
    if (item.action === BTN_ACTIONS.ADD) {
      addAnimSpan(item.display);
      const oper = item.display !== "x" ? item.display : "*";
      setExpression((prevExpression) => prevExpression + oper);
      return;
    }
    if (item.action === BTN_ACTIONS.BACKSPACE) {
      const currentExp = expression;
      setExpression(currentExp.slice(0, -1)); // Menghapus karakter terakhir
      expDiv.innerHTML = currentExp.slice(0, -1);
      return;
    }
    if (item.action === BTN_ACTIONS.DELETE) {
      expDiv.parentNode.querySelector("div:last-child").innerHTML = "";
      expDiv.innerHTML = "";
      setExpression("");
      return;
    }
    if (item.action === BTN_ACTIONS.MOD) {
      addAnimSpan(item.display);
      setExpression((prevExpression) => prevExpression + "%");
      return;
    }

    if (item.action === BTN_ACTIONS.CALC) {
      if (expression.trim().length <= 0) return;

      expDiv.parentNode.querySelector("div:last-child").remove();

      const cloneNode = expDiv.cloneNode(true);
      expDiv.parentNode.appendChild(cloneNode);

      const transform = `translateY(${
        -(expDiv.offsetHeight + 10) + "px"
      }) scale(0.4)`;

      try {
        let res = eval(expression);
        setExpression(res.toString());
        if (expression.includes("%")) {
          // Menangani operasi modulus
          const [operand1, operand2] = expression.split("%");
          res = parseFloat(operand1) % parseFloat(operand2);
        } else {
          // Jika bukan operasi modulus, lakukan evaluasi biasa
          res = eval(expression);
        }
        setTimeout(() => {
          cloneNode.style.transform = transform;
          expDiv.innerHTML = "";
          addAnimSpan(Math.floor(res * 100000000) / 100000000);
        }, 200);
      } catch {
        setTimeout(() => {
          cloneNode.style.transform = transform;
          cloneNode.innerHTML = "Syntax err";
        }, 200);
      } finally {
        console.log("calc complete");
      }

      return;
    }
  };

  const addAnimSpan = (content) => {
    const expDiv = expRef.current;
    const span = document.createElement("span");

    span.innerHTML = content;
    span.style.opacity = "0";
    expDiv.appendChild(span);

    const width = span.offsetWidth + "px";
    span.style.width = "0";

    setTimeout(() => {
      span.style.opacity = "1";
      span.style.width = width;
    }, 100);
  };

  return (
    <div className={`calculator ${darkMode ? "dark" : ""}`}>
      <h3 className="logo">RenDev</h3>
      <div className="calculator__result">
        <div ref={expRef} className="calculator__result__exp"></div>
        <div className="calculator__result__exp"></div>
      </div>
      <div ref={btnsRef} className="calculator__btns">
        {btns.map((item, index) => (
          <button
            key={index}
            className={item.class}
            onClick={() => btnClick(item)}
          >
            {item.display}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
