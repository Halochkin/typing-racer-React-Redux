import {defaultState} from "./rootReducer";

function countWPM(state, durationMs) {
  let minutes = (durationMs) / 1000 / 60;
  return {wpm: (state.separateWords.length / 5) / minutes, cpm: state.separateWords.join("").length / minutes}
}

async function doRequest(method, path, body) {
  const options = {
    method,
    credentials: 'include'
  }
  if (body)
    options.body = body;
  let res = await fetch(path, options);
  return res.json();
}

export function handleInputData(state, e) {
  let startTime;
  if (!state.startTime) {
    startTime = Date.now();
    state.startTime = startTime;
  }

  const key = e.key;
  const selectionStart = e.currentTarget.selectionStart;
  const selectionEnd = e.currentTarget.selectionEnd;
  const selectionRange = selectionEnd - selectionStart;

  let characterIndex = state.characterIndex;
  let wordIndex = state.wordIndex;
  let inputValues = [...state.inputValues];

  if (key.length === 1) { //exclude technical keys (Enter etc) but allow all another (even non a-Z) //todo regex here?
    if (selectionRange) {
      inputValues.splice(selectionStart, selectionRange, key);
      characterIndex = selectionStart + 1;
    } else {
      inputValues.splice(selectionStart, 0, key);
      characterIndex = inputValues.length
    }
  }

  if (key === "Backspace" && inputValues.length) {
    if (selectionRange) {  //someone selected text and removed
      inputValues.splice(selectionStart, selectionRange);
      characterIndex = selectionStart
    } else if (selectionStart !== 0) {
      inputValues.splice(selectionStart - 1, 1)
      characterIndex = state.characterIndex - 1;
    } else
      inputValues.pop();
  }

  // When press Space
  if (key === " " && state.expectedCharacter === " " && state.inputValues.join("") === state.separateWords[wordIndex].trim() && selectionEnd === state.separateWords[wordIndex].trim().length) {
    wordIndex++;
    characterIndex = 0;
    inputValues = [];
  }

  let currentWord = state.separateWords[wordIndex];
  let typedCharacters = currentWord.slice(0, characterIndex);
  let expectedCharacter = currentWord.charAt(characterIndex);

  const typedItem = document.querySelector("type-racer").shadowRoot.querySelector("#typed")


  if (inputValues.length && inputValues[inputValues.length - 1] !== expectedCharacter)
    typedItem.classList.add("err");          // add error
  if (typedCharacters === inputValues.join("") || inputValues.join("") === state.separateWords[wordIndex] || inputValues.join("") === state.separateWords[state.wordIndex].slice(0, characterIndex))
    typedItem.classList.remove("err");   //remove error



  state.inputValues = inputValues
  state.characterIndex = characterIndex
  state.wordIndex = wordIndex
  state.typedCharacters = typedCharacters;
  state.expectedCharacter = expectedCharacter;
  state.remainedCharacters = currentWord.slice(characterIndex + 1, currentWord.length)
  state.typedWords = [...state.separateWords].slice(0, wordIndex)
  state.sessionHistory = [...state.sessionHistory, [key, Date.now() - state.startTime, characterIndex]]
  state.remainedWords = [...state.separateWords].slice(wordIndex + 1, state.separateWords.length).join(" ")

  //last character of last word
  if (wordIndex === state.separateWords.length - 1 && characterIndex === state.separateWords[state.separateWords.length - 1].length && state.inputValues.join("") === state.typedCharacters) {
    let result = countWPM(state, Date.now() - state.startTime);
      setTimeout(() => {
        document.querySelector("type-racer").shadowRoot.querySelector("#main-input").value = ""
      })
    let data = JSON.stringify({
      sessionId: Date.now(),
      wpm: result.wpm.toFixed(2),
      cpm: result.cpm.toFixed(2),
      history: JSON.stringify([...state.sessionHistory]),
      expression: state.separateWords.join("")
    });

    doRequest("POST", "https://typing-race.maksgalochkin2.workers.dev/json", data).then(res => {})
    renderSessions([data]);
    let newState = {...defaultState}; //reset state
    newState.sessionResult = "wpm: " + result.wpm.toFixed(0) + " cpm: " + result.cpm.toFixed(0);
    return newState;
  }

  return state;
}

function random_rgba() {
  let o = Math.round, r = Math.random, s = 255;
  return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
}


function renderSessions(state) {
  for (const session of state) {
    const parsedSession = JSON.parse(session);
    let rgb = random_rgba();

    let prevWrapper = document.createElement("div");
    let prevSpeed = document.createElement("div");
    let input = document.createElement("textarea");

    let closeBtn = document.createElement("span");
    let repeatBtn = document.createElement("span");

    closeBtn.classList.add("close-btn");
    closeBtn.textContent = "X";
    closeBtn.id = parsedSession.sessionId;
    closeBtn.addEventListener("click", async (e) => { //todo: remove session
      let grandParent = input.parentNode.parentElement;
      let data = JSON.stringify({key: '' + e.currentTarget.id});
      let status = await doRequest("DELETE", "https://typing-app.maksgalochkin2.workers.dev/delete", data).then(data => data)
      grandParent.removeChild(prevWrapper);
    });

    repeatBtn.textContent = "↻";
    repeatBtn.classList.add("repeat-btn");

    repeatBtn.addEventListener("click", (e) => {
      repeatSession(parsedSession, input, prevSpeed);
    });

    input.setAttribute("readonly", "");

    prevSpeed.classList.add("previous-speed");
    prevSpeed.style.backgroundColor = rgb;

    prevWrapper.classList.add("prev-wrapper");
    prevWrapper.appendChild(prevSpeed);
    prevWrapper.appendChild(repeatBtn);
    prevWrapper.appendChild(closeBtn);
    prevWrapper.appendChild(input);

    document.querySelector("type-racer").shadowRoot.querySelector("#previous-results").appendChild(prevWrapper);

    repeatSession(parsedSession, input, prevSpeed);
  }
}

function repeatSession(session, input, div) {
  const parsedHistory = JSON.parse(session.history);
  // to disable sync repeating.
  if (input.value && input.value !== session.expression)
    return;

  if (input.value.length)
    input.value = "";

  //todo: disable double repeating  at the same time
  const wpm = session.wpm;
  const cpm = session.cpm;

  for (const character of parsedHistory) {
    setTimeout(() => {
      if (character[0] !== "Backspace")
        input.value += character[0];
      else
        input.value = input.value.slice(0, input.value.length - 1);  //delete character
    }, character[1]);
  }

  div.textContent = "wpm: " + wpm + "    cpm: " + cpm;
}

export function getAllSessions(state) {
  doRequest('GET', "https://typing-race.maksgalochkin2.workers.dev/getsessions").then(data => {
    // alert(JSON.stringify(data))
    this.renderSessions(data);
  });
  return state
}




