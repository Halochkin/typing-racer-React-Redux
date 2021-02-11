import {combineReducers} from "redux";
import {handleInputData, getAllSessions} from "./Reducers.js";
import {HANDLE_INPUT, GET_ALL} from "./types"; //reducer functions


const getSeparateWords = (expression) => {
  let separateWords = expression.trim().split(" ");
  for (let i = 0; i < separateWords.length - 1; i++) {  //add space to each word beside last one
    separateWords[i] += " ";
  }
  return separateWords;
}
const expression = "Lorem ipsum";
const separateWords = getSeparateWords(expression);

export const defaultState = {
  wordIndex: 0,
  characterIndex: 0,
  startTime: 0,
  inputValues: [],
  sessionHistory: [],
  separateWords: separateWords,
  typedWords: [],
  typedCharacters: "",
  sessionResult: "",
  expectedCharacter: separateWords[0][0],
  remainedCharacters: separateWords[0].slice(1, separateWords[0].length),
  remainedWords: separateWords.slice(1, separateWords.length).join(" "),
}

const getImmutableState = (state = defaultState, action) => {

  switch (action.type) {
    case HANDLE_INPUT:
      return handleInputData({...state}, action.payload);
  case GET_ALL:
      return getAllSessions({...state});
    default:
      return {...state}
  }
}



export const initialState = combineReducers({
   getImmutableState
})



