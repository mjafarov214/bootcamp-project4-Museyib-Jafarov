let inputFrom = document.querySelector("#from-section-input");
let inputTo = document.querySelector("#to-section-input");
let infoFrom = document.querySelector("#from-section-info");
let infoTo = document.querySelector("#to-section-info");
let valuteArray = document.querySelectorAll(".valute-array");
const valuteArrayFrom = document.querySelector("#valute-array-from");
const valuteArrayTo = document.querySelector("#valute-array-to");
const arrowForBack = document.querySelector("#arrow-back");
let valuteFromAll = document.querySelector("#from-section-valute");
let valuteToAll = document.querySelector("#to-section-valute");

let lastSearch = "";

// Получем все актуальные валюты из сервера
let list = fetch(`https://api.ratesapi.io/api/latest`)
  .then((result) => {
    const str = result.json();
    return str;
  })
  .then((data) => {
    const rate = data.rates;
    makeList(rate);
    return rate;
  });

// Функция записывающая все эти валюты в один лист
function makeList(obj) {
  let objectToInspect;
  let result = [];
  for (
    objectToInspect = obj;
    objectToInspect !== null;
    objectToInspect = Object.getPrototypeOf(objectToInspect)
  ) {
    result = result.concat(Object.getOwnPropertyNames(objectToInspect));
  }
  valuteArray.forEach((item) => {
    for (let i = 0; i < result.length; i++) {
      if (
        result[i].length == 3 &&
        result[i] != "RUB" &&
        result[i] != "USD" &&
        result[i] != "EUR" &&
        result[i] != "GBP"
      ) {
        const row = document.createElement("p");
        row.innerHTML = result[i];
        item.appendChild(row);
      }
    }
  });
}

// Функция которая значения валюты на левой стороне, а также скрывающая лист валюты.
function changeValuteFrom() {
  let valuteFrom = document.querySelectorAll("#from-section-valute div");
  valuteFrom.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.innerHTML == valuteFrom[4].innerHTML) {
        valuteArrayFrom.classList.toggle("hidden");
      } else {
        valuteArrayFrom.classList.add("hidden");
      }
      valuteFrom.forEach((item) => {
        item.classList.remove("valuteSelect");
      });
      e.target.classList.add("valuteSelect");
      let valuteArrayFromList = document.querySelectorAll(
        "#valute-array-from p"
      );
      setValuteFromList(valuteFrom, valuteArrayFromList);
      if (lastSearch == true) {
        calculate();
      } else if (lastSearch == false) {
        calculateTo();
      }
    });
  });
}

// Функция которая значения валюты на правой стороне, а также скрывающая лист валюты.
function changeValuteTo() {
  let valuteTo = document.querySelectorAll("#to-section-valute div");
  valuteTo.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.innerHTML == valuteTo[4].innerHTML) {
        valuteArrayTo.classList.toggle("hidden");
      } else {
        valuteArrayTo.classList.add("hidden");
      }
      valuteTo.forEach((item) => {
        item.classList.remove("valuteSelect");
      });
      e.target.classList.add("valuteSelect");
      let valuteArrayToList = document.querySelectorAll("#valute-array-to p");
      setValuteFromList(valuteTo, valuteArrayToList);
      if (lastSearch == true) {
        calculate();
      } else if (lastSearch == false) {
        calculateTo();
      }
    });
  });
}

//Функия записывающая значение валюты если она выбрана из листа в div который сверху него
function setValuteFromList(section, list) {
  list.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      let custValute = e.target.innerHTML;
      section[4].innerHTML = `${custValute}  &#8744`;
      e.target.parentElement.classList.add("hidden");
      if (lastSearch == true) {
        calculate();
      } else if (lastSearch == false) {
        calculateTo();
      }
    });
  });
}

// Функция меняющая значения левой и правой стороны на обратное
arrowForBack.addEventListener("click", reverseConvert);
function reverseConvert() {
  let valuteAllCopy = valuteFromAll.innerHTML;
  valuteFromAll.innerHTML = valuteToAll.innerHTML;
  valuteToAll.innerHTML = valuteAllCopy;
  inputFrom.value = inputTo.value;
  changeValuteTo();
  changeValuteFrom();
  calculate();
}

// Функция которая округляет дробную часть числа для красоты:)
function roundPlus(x, n) {
  //x - число, n - количество знаков
  if (isNaN(x) || isNaN(n)){ return false;}
  let m = Math.pow(10, n);
  return Math.round(x * m) / m;
}

//Функция которая отвечает за ввод на левой стороне
inputFrom.addEventListener("input", calculate);
function calculate() {
  inputFrom.value = cleanAllwords(inputFrom.value);
  const currentValuteFrom = document
    .querySelector("#from-section-valute .valuteSelect")
    .innerHTML.slice(0, 3);
  const currentValuteTo = document
    .querySelector("#to-section-valute .valuteSelect")
    .innerHTML.slice(0, 3);
  let popup = document.querySelector("#popup-parent");
  popup.style.display = "flex";
  lastSearch = true;
  fetch(
    `https://api.ratesapi.io/api/latest?base=${currentValuteFrom}&symbols=${currentValuteTo}`
  )
    .then((result) => {
      const str = result.json();
      return str;
    })
    .then((data) => {
      const rate = data.rates;
      return rate;
    })
    .then((rate) => {
      let result = inputFrom.value * rate[currentValuteTo];
      inputTo.value = roundPlus(result, 3);
      infoFrom.innerHTML = `1 ${currentValuteFrom} = ${rate[currentValuteTo]} ${currentValuteTo}`;
    });
  fetch(
    `https://api.ratesapi.io/api/latest?base=${currentValuteTo}&symbols=${currentValuteFrom}`
  )
    .then((result) => {
      popup.style.display = "none";
      const str = result.json();
      return str;
    })
    .then((data) => {
      const rate = data.rates;
      return rate;
    })
    .then((rate) => {
      infoTo.innerHTML = `1 ${currentValuteTo} = ${rate[currentValuteFrom]} ${currentValuteFrom}`;
    })
    .catch(() => alert(`Что-то пошло не так :-( \nПросим попробывать позже.`));
}

//Функция которая отвечает за ввод на правой стороне
inputTo.addEventListener("input", calculateTo);
function calculateTo() {
  inputTo.value = cleanAllwords(inputTo.value);
  const currentValuteFrom = document
    .querySelector("#from-section-valute .valuteSelect")
    .innerHTML.slice(0, 3);
  const currentValuteTo = document
    .querySelector("#to-section-valute .valuteSelect")
    .innerHTML.slice(0, 3);
  let popup = document.querySelector("#popup-parent");
  popup.style.display = "flex";
  lastSearch = false;
  fetch(
    `https://api.ratesapi.io/api/latest?base=${currentValuteFrom}&symbols=${currentValuteTo}`
  )
    .then((result) => {
      const str = result.json();
      return str;
    })
    .then((data) => {
      const rate = data.rates;
      return rate;
    })
    .then((rate) => {
      infoFrom.innerHTML = `1 ${currentValuteFrom} = ${rate[currentValuteTo]} ${currentValuteTo}`;
    });
  fetch(
    `https://api.ratesapi.io/api/latest?base=${currentValuteTo}&symbols=${currentValuteFrom}`
  )
    .then((result) => {
      popup.style.display = "none";
      const str = result.json();
      return str;
    })
    .then((data) => {
      const rate = data.rates;
      return rate;
    })
    .then((rate) => {
      let result = inputTo.value * rate[currentValuteFrom];
      inputFrom.value = roundPlus(result, 3);
      infoTo.innerHTML = `1 ${currentValuteTo} = ${rate[currentValuteFrom]} ${currentValuteFrom}`;
    })
    .catch(() => alert(`Что-то пошло не так :-( \nПросим попробывать позже.`));
}

function cleanAllwords(input) {
  let dirtyInput = input;
  let cleanInput = "";
  let isFirstDot = true;
  for (let i = 0; i < dirtyInput.length; i++) {
    if (isFirstDot && (dirtyInput[i] === "." || dirtyInput[i] === ",")) {
      cleanInput += dirtyInput[i];
      isFirstDot = false;
    }
    if (!isNaN(dirtyInput[i])) {
      cleanInput += dirtyInput[i];
    }
    if (dirtyInput.length == 1 && dirtyInput[i] == ".") {
      cleanInput = "";
    }
  }
  return cleanInput.replace(",", ".");
}

changeValuteTo();
changeValuteFrom();
calculate();
