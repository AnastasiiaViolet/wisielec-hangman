//Wstępne referencje
const letterContainer = document.getElementById("letter-container");
const optionsContainer = document.getElementById("options-container");
const userInputSection = document.getElementById("user-input-section");
const newGameContainer = document.getElementById("new-game-container");
const newGameButton = document.getElementById("new-game-button");
const canvas = document.getElementById("canvas");
const resultText = document.getElementById("result-text");
const anulujGreButton = document.getElementById("anuluj_gre");
const contener = document.querySelector(".wraper");

//Wartosci LocalStoreg
let wykorzystaneLiteryNiePoprawne = [];
let wykorzystaneLiteryPoprawne = [];
let koniecGry = false;
//Wartości dla wyboru tematów
let options = {
  owoce: [
    "Jabłko",
    "Borówka",
    "Mandaryn",
    "Ananas",
    "Arbuz",
    "Pomarańcza",
    "Kiwi",
    "Banan",
    "Truskawka",
    "Grejpfrut",
    "Granat",
    "Grusza",
    "Brzoskwinia",
    "Winogrono",
  ],
  zwierzęta: [
    "Zebra",
    "Mors",
    "Pantera",
    "Wiewiórka",
    "Pająk",
    "Kot",
    "Pies",
    "Wąż",
    "Lew",
  ],
  kraj: [
    "Indie",
    "Ukraina",
    "Polska",
    "Wegry",
    "Chiny",
    "Włochy",
    "Japonia",
    "Kanada",
    "Rumunia",
    "Niemcy",
  ],
};
//Liczba do polskiego alfabetu
const polishLetters = [260, 262, 280, 321, 323, 211, 346, 379, 377];
//liczyć
let winCount = 0;
let count = 0; //licznik blędów

let chosenWord = "";

//Wyświetl przyciski tematów z onClick
const displayOptions = () => {
  optionsContainer.innerHTML += `<h3>Proszę wybrać temat</h3>`;
  let buttonCon = document.createElement("div");
  for (let value in options) {
    if (value === "kraj") {
      buttonCon.innerHTML += `<button class="options" id="button3" onclick="generateWord('${value}')">${value}</button>`;
    } else {
      buttonCon.innerHTML += `<button class="options" onclick="generateWord('${value}')">${value}</button>`;
    }
  }
  optionsContainer.appendChild(buttonCon);
};

//Zablokuj wszystkie przyciski
const blocker = () => {
  let optionsButtons = document.querySelectorAll(".options");
  let letterButtons = document.querySelectorAll(".letters");
  //wyłącz wszystkie przyciskie tematów
  optionsButtons.forEach((button) => {
    button.disabled = true;
  });
  //wyłącz wszystkie przyciski litter
  letterButtons.forEach((button) => {
    button.disabled = true;
  });
  anulujGreButton.disabled = true;
  newGameContainer.classList.remove("hide");
};

//Generator słów (już zainicilizowane kiedy tworzymy button i tam jest oncklick)
const generateWord = (optionValue) => {
  //przy kliku na przycisk on zapuszcza funkcje generateWord(optionValue to wartość która bierzysie z tablicy tematów)
  let optionsButtons = document.querySelectorAll(".options");
  //Jeśli optionValue pasuje do przycisku innerText (jest wybrany przycisk), podświetl przycisk
  optionsButtons.forEach((button) => {
    if (button.innerText.toLowerCase() === optionValue) {
      //innerText - otrzyma text z knopki który można zmienić , toLowerCase() - zmniejsza litery
      button.classList.add("active");
    }
    button.disabled = true; //robi nie wybrane przyciski nie aktywnymi
  });
  //usuwamy z litery hide (co ukrywa nam container liter), wyczyść poprzednie słowo
  letterContainer.classList.remove("hide");
  userInputSection.innerText = "";

  let optionArray = options[optionValue]; //Wybieramy z listy tematów wybrany temat i otrzymamy liste słów tego tematu
  //wybierz losowe słowo
  chosenWord = optionArray[Math.floor(Math.random() * optionArray.length)];
  chosenWord = chosenWord.toUpperCase(); // zwiększamy wylosowane slowo
  localStorage.setItem("wylosowaneSlowo", chosenWord);
  localStorage.setItem("wybranyTemat", optionValue);
  console.log(chosenWord);

  // zastąp każdą literę span zawierającą myślnik
  //replace to metod który z zamienia slowo /./-który pasuje do dowolnego pojedynczego znaku z wyjątkiem nowej linii, g- wyszukaj wszystkie wystąpienia wyrażenia regularnego w całym łańcuchu
  let displeyItem = chosenWord.replace(/./g, '<span class="dashes">_</span>'); //bierzemy wybrane slowo i zamieniamy na span...
  ///./g - aby wyszukać wszystkie znaki w ciągu.

  userInputSection.innerHTML = displeyItem; // i dodajemy do html
};

//Funkcja początkowa (wywoływana, gdy strona ładuje się/użytkownik uruchamia nową grę)
const initializer = (nowaGra) => {
  // localStorage.clear();
  //Początkowo usuń całą zawartość i ukryj litery oraz przycisk nowej gry

  userInputSection.innerHTML = "";
  optionsContainer.innerHTML = "";
  letterContainer.classList.add("hide");
  newGameContainer.classList.add("hide");
  letterContainer.innerHTML = "";
  wykorzystaneLiteryPoprawne = [
    localStorage.getItem("wykorzystaneLiteryPoprawne"),
  ];
  wykorzystaneLiteryNiePoprawne = [
    localStorage.getItem("wykorzystaneLiteryNiePoprawne"),
  ];
  console.log(wykorzystaneLiteryPoprawne);
  console.log(wykorzystaneLiteryNiePoprawne);
  console.log(nowaGra);

  console.log(koniecGry);
  //jeśli mamy wykorzystaneLiteryPoprawne i to nie noa gra to
  if (
    (wykorzystaneLiteryPoprawne[0] !== null ||
      wykorzystaneLiteryNiePoprawne[0] !== null) &&
    nowaGra !== true
  ) {
    //!!!!!!!może trzeba zmienić warunki

    let { initialDrawing } = canvasCreator(); //pobieramy initialDrawing z funkcji canvasCreator który zwraca liste funkcij
    //initialDrawing narysuje ramkę
    initialDrawing();

    chosenWord = localStorage.getItem("wylosowaneSlowo");
    console.log(chosenWord);
    wykorzystaneLiteryPoprawne = localStorage
      .getItem("wykorzystaneLiteryPoprawne")
      .split(",");
    console.log(wykorzystaneLiteryPoprawne);
    let displeyItem = chosenWord.replace(/./g, '<span class="dashes">_</span>');
    userInputSection.innerHTML = displeyItem;
    wykorzystaneLiteryNiePoprawne = localStorage
      .getItem("wykorzystaneLiteryNiePoprawne")
      .split(",");
    displayOptions();
    for (let i = 65; i < 91; i++) {
      let button = document.createElement("button");
      button.classList.add("letters");
      //Liczba do ASCII[A-Z]

      button.innerText = String.fromCharCode(i);
      if (wykorzystaneLiteryNiePoprawne.includes(button.innerText)) {
        buttonEventLeter(button);
        button.disabled = true;
      }
      if (wykorzystaneLiteryPoprawne.includes(button.innerText)) {
        buttonEventLeter(button);
        button.disabled = true;
      }
      //kliknij przycisk znaku
      button.addEventListener("click", () => {
        buttonEventLeter(button);
      });
      //dodajemy do containera liter
      letterContainer.append(button);
    }
    polishLetters.forEach((letter) => {
      let button = document.createElement("button");
      button.classList.add("letters");
      button.innerText = String.fromCharCode(letter);
      if (wykorzystaneLiteryNiePoprawne.includes(button.innerText)) {
        buttonEventLeter(button);
        button.disabled = true;
      }
      if (wykorzystaneLiteryPoprawne.includes(button.innerText)) {
        buttonEventLeter(button);
        button.disabled = true;
      }
      button.addEventListener("click", () => {
        buttonEventLeter(button);
      });

      letterContainer.append(button);
    });

    let pobraryTemat = localStorage.getItem("wybranyTemat");
    let optionsButtons = document.querySelectorAll(".options");
    optionsButtons.forEach((button) => {
      if (button.innerText.toLowerCase() === pobraryTemat) {
        //innerText - otrzyma text z knopki który można zmienić , toLowerCase() - zmniejsza litery
        button.classList.add("active");
      }
      button.disabled = true; //robi nie wybrane przyciski nie aktywnymi
    });
    //usuwamy z litery hide (co ukrywa nam container liter), wyczyść poprzednie słowo
    letterContainer.classList.remove("hide");
    // userInputSection.innerText = "";

    // localStorage.clear();
  } else {
    koniecGry = false;
    winCount = 0;
    count = 0;

    //Do tworzenia przycisków literowych
    for (let i = 65; i < 91; i++) {
      let button = document.createElement("button");
      button.classList.add("letters");
      //Liczba do ASCII[A-Z]
      button.innerText = String.fromCharCode(i);
      //kliknij przycisk znaku
      button.addEventListener("click", () => {
        buttonEventLeter(button);
      });
      //dodajemy do containera liter
      letterContainer.append(button);
    }
    //przechodzimy po liscie i tworzymy przyciski polskich liter
    polishLetters.forEach((letter) => {
      let button = document.createElement("button");
      button.classList.add("letters");
      button.innerText = String.fromCharCode(letter);
      button.addEventListener("click", () => {
        buttonEventLeter(button);
      });

      letterContainer.append(button);
    });
    displayOptions();
    // wywołanie funkcji canvasCreator (w celu wyczyszczenia poprzedniego płótna i utworzenia początkowego płótna)
    let { initialDrawing } = canvasCreator(); //pobieramy initialDrawing z funkcji canvasCreator który zwraca liste funkcij
    //initialDrawing narysuje ramkę
    initialDrawing();
    if (nowaGra) {
      localStorage.clear();
    }
    anulujGreButton.disabled = false;
    wykorzystaneLiteryNiePoprawne = [];
    wykorzystaneLiteryPoprawne = [];
  }
  if (koniecGry && nowaGra !== true) {
    console.log("ew");
    blocker();
  }
};
//Funkcja dla ckiku na littere
function buttonEventLeter(button) {
  let charArray = chosenWord.split("");
  // console.log(charArray);
  let dashes = document.getElementsByClassName("dashes");
  // console.log(dashes);
  // jeśli tablica zawiera klikniętą wartość, zastąp pasujący myślnik literą else dram na płótnie
  //includes - sprawdza czy lista charArray zawiera podaną wartość
  if (charArray.includes(button.innerText)) {
    if (
      wykorzystaneLiteryPoprawne !== null &&
      !wykorzystaneLiteryPoprawne.includes(button.innerText)
    ) {
      wykorzystaneLiteryPoprawne.push(button.innerText);
    }

    console.log(button.innerText);
    charArray.forEach((char, index) => {
      //jeśli znak w tablicy jest taki sam jak kliknięty przycisk
      if (char == button.innerText) {
        //zastąp myślnik literą
        dashes[index].innerText = char;
        //licznik ktory liczy ile są odgadanych liter
        winCount += 1;
        //jeśli winCount jest równe długości słowa
        if (winCount == charArray.length) {
          koniecGry = true;
          resultText.innerHTML = `<h2 class="win-msg">Wygrałeś/łaś!!!</h2><p>Poprawne słowo było <span>${chosenWord}</span></p>`;
          //zablokuj wszystkie przyciski
          blocker();
        }
      }
    });
  } else {
    if (
      wykorzystaneLiteryNiePoprawne !== null &&
      !wykorzystaneLiteryNiePoprawne.includes(button.innerText)
    ) {
      wykorzystaneLiteryNiePoprawne.push(button.innerText);
    }

    //licznik błędów
    count += 1;
    //do rysowania człowieka
    drawMan(count);
    //Count==9 ponieważ liniaProsta,liniaGurna,liniaMala, head,body,left arm,right arm,left leg,right leg
    // console.log(count);
    if (count == 9) {
      koniecGry = true;
      resultText.innerHTML = `<h2 class="lose-msg">Przegrałeś/łaś!!!</h2><p>Poprawne słowo było <span>${chosenWord}</span></p>`;
      blocker();
    }
  }
  localStorage.setItem(
    "wykorzystaneLiteryPoprawne",
    wykorzystaneLiteryPoprawne
  );
  localStorage.setItem(
    "wykorzystaneLiteryNiePoprawne",
    wykorzystaneLiteryNiePoprawne
  );
  //wyłączony kliknięty przycisk
  button.disabled = true;
}
//Canvas
const canvasCreator = () => {
  let context = canvas.getContext("2d");
  context.beginPath(); //Metoda beginPath() rozpoczyna rysowanie nowej ścieżki (wielokąta). Wszystkie kolejne polecenia rysowania będą odwoływać się do tej nowej ścieżki.
  context.strokeStyle = "#000"; //Ustawianie koloru konturu do rysowania(linie co rysujemy)
  context.lineWidth = 2; //ustawienie grubości linii konturu
  // context.canvas.width = contener.width;
  // context.canvas.height = contener.height;

  //Do rysowania linii
  const drawLine = (fromX, fromY, toX, toY) => {
    context.moveTo(fromX, fromY); //punkt początkowe
    context.lineTo(toX, toY); //punkt końcowy
    context.stroke(); //pokazuje na canvas
  };

  const head = () => {
    context.beginPath(); //bo do tego rysowali linie(używamy kiedy rusujemy iną figure)(to pozwala poprawnie łączyć punkty i oddzielać od siebie różne figure)
    context.arc(120, 30, 10, 0, Math.PI * 2, true); //10-radius,(70,30)-center kola,PI*2 - kát poczátku i koñca ,true-należy rysować przeciwnie do ruchu wskazówek zegara(moæe nie trzeba).
    context.stroke();
  };
  const body = () => {
    drawLine(120, 40, 120, 80);
  };

  const leftArm = () => {
    drawLine(120, 40, 100, 70);
  };
  const rightArm = () => {
    drawLine(120, 40, 140, 70);
  };
  const leftLeg = () => {
    drawLine(120, 80, 100, 110);
  };
  const rightLeg = () => {
    drawLine(120, 80, 140, 110);
  };
  const liniaProsta = () => {
    //linia(|)
    drawLine(70, 10, 70, 131);
  };
  const liniaGurna = () => {
    //linia górna (-)
    drawLine(70, 10, 120, 10);
  };
  const liniaMala = () => {
    //mala linia(|)
    drawLine(120, 10, 120, 20);
  };

  //początkowy rysunek
  const initialDrawing = () => {
    //Dla sprzątania wybranego odczinku  x , y, witdth i hight
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    //dolna linia(--)
    drawLine(10, 130, 130, 130);
  };

  return {
    initialDrawing,
    liniaProsta,
    liniaGurna,
    liniaMala,
    head,
    body,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
  };
};

//rysuje wisielca
const drawMan = (count) => {
  let {
    liniaProsta,
    liniaGurna,
    liniaMala,
    head,
    body,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
  } = canvasCreator();
  switch (count) {
    case 1:
      liniaProsta();
      break;
    case 2:
      liniaGurna();
      break;
    case 3:
      liniaMala();
      break;
    case 4:
      head();
      break;
    case 5:
      body();
      break;
    case 6:
      leftArm();
      break;
    case 7:
      rightArm();
      break;
    case 8:
      leftLeg();
      break;
    case 9:
      rightLeg();
      break;
    default:
      break;
  }
};
//Nowa gra
newGameButton.addEventListener("click", () => {
  initializer(true);
});
//Anuluje i zaczyna nową gre
anulujGreButton.addEventListener("click", () => {
  initializer(true);
});
//jest to zdarzenie, które jest uruchamiane, gdy strona internetowa jest w pełni załadowana, w tym wszystkie jej zasoby(potem będzie automatycznie wypelniać się podana metoda)
window.onload = initializer(false);
