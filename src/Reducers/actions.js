import {HANDLE_INPUT} from "./types";
import {GET_ALL} from "./types";

export function handleInputEvent(event) {
  return {
    type: HANDLE_INPUT,
    payload: event
  }
}
export function getAllSessions() {
  return {
    type: GET_ALL,
  }
}