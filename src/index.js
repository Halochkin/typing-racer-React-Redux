import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


import {Provider} from "react-redux"; //Pass state obj to children elements

import {createStore} from "redux"; // create store
import {initialState} from "./Reducers/rootReducer";


let state = createStore(initialState,   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


//pass state to APP
ReactDOM.render(
  <Provider store={state}>
    <App/>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();





























// -------------------------------------------------ROOT-REDUCER.JS------------------------
//
//
// const defaultState = {                 //initial state
//   hello: " world"
// }
//
// const getImmutableState = (state = {...defaultState}, action) => {   //step 1
//   switch (action.type) {
//     case "HANDLE_CLICK": return someAppFunction(state, action.payload);  // will be described below
//     default:
//       return {...state}
//   }
// }
//
// export const initialState = combineReducers({                    //step 2
//   getImmutableState
// })
//
//
// -------------------------------------------------APP.JS------------------------
// import createStore from 'react'
// import initialState from ROOT-REDUCER.JS
//
//   let state = createStore(initialState);  //step 4
//
//
// //pass state to APP
// ReactDOM.render(
//   <Provider store={state}>              //step 9
//     <App/>
//   </Provider>,
//   document.getElementById('root')
// );
//
//
// -------------------------------------------------APP.JS------------------------
//
// import App from
// import {handleInputEvent} from "./store/Reducers/actions";
// import {HANDLE_INPUT} from "./store/Reducers/types"; ROOT_REDUCER.JS
//
// class App extends Component {
//   constructor(props) {
//     super(props);
//   }
//
//   render(){
//     return
//     <h1 onClick={this.someHandler}>Some html</h1>     //listen user action  step 10
//   }
//
//   someHandler(e){
//     this.props.handlecClickEvent(e);     //!!! TO MAKE IT POSSIBLE TO ADD ANY HANDLER FUNCTION INTO THIS.PROPS  YOU MUST USE CONNECT(), SEE BELOW
//   }
//
// }
//
// function mapStateToProps(state) {             // HERE WE ADD STATE we created AT STEP 4, SO   THIS.PROPS.STATE.HELLO WILL BE POSSIBLE
//   return {
//     state: state.getImmutableState           //FROM STATE 1( RETURN COPY OF INITIAL STATE)
//   }
// }
//
// const mapDispatchToProps = {                 // THIS SHIT MAKE IT POSSIBLE TO ADD HANDLER FUNCTIONS TO THIS.PROPS (WE USE INSIDE someHandler() above
//   handleInputEvent
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)(App);  // connect both this.props  to REACT component
//
// -------------------------------------------------ACTIONS.JS------------------------
// export function handlecClickEvent(event) { //Actually it is not function to handle event, just define type of action and data to pass
//   return {
//     type: "HANDLE_CLICK",         //Function from step 1 listen type properties and after that starts to hanle event by calling  someAppFunction which starts do something
//     payload: event
//   }
// }
// ------------------------------------------------------------------------------------
//
// --


