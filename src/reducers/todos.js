import {
  ADD_TODO,
  DELETE_TODO,
  EDIT_TODO,
  COMPLETE_TODO,
  COMPLETE_ALL_TODOS,
  CLEAR_COMPLETED,
  UNDO_TODO,
  REDO_TODO
} from '../constants/ActionTypes'

const initialState = [
  {
    text: 'Use Redux',
    completed: false,
    id: 0
  }
]

let stateHistory = [initialState];
let stateHistoryRedo = [initialState];

export default function todos(state = initialState, action) {
  // console.log('state:',state);

  const newToDo = {
    id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
    completed: false,
    text: action.text
  }
  switch (action.type) {

    case ADD_TODO:
      stateHistory.push([...state, newToDo]);
      stateHistoryRedo = stateHistory;
      return [
        ...state,
        newToDo
      ]

    case DELETE_TODO:
      return state.filter(todo => todo.id !== action.id)

    case EDIT_TODO:
      return state.map(todo =>
        todo.id === action.id ?
          { ...todo, text: action.text } :
          todo
      )

    case COMPLETE_TODO:
      return state.map(todo =>
        todo.id === action.id ?
          { ...todo, completed: !todo.completed } :
          todo
      )

    case COMPLETE_ALL_TODOS:
      const areAllMarked = state.every(todo => todo.completed)
      return state.map(todo => ({
        ...todo,
        completed: !areAllMarked
      }))

    case CLEAR_COMPLETED:
      return state.filter(todo => todo.completed === false)

    case UNDO_TODO:
      let maxUndo = stateHistoryRedo.length;
      let atualUndo = stateHistory.length;
      stateHistory = stateHistory.slice(0, stateHistory.length - 1);
      state = stateHistory[stateHistory.length - 1]
      // console.log('stete',state)
      // console.log('stateHistory',stateHistory)
      // console.log('max', maxUndo, ' atual: ', atualUndo)
      if (stateHistory.length >= 1)
        return state
      else
        return initialState

    case REDO_TODO:
      let atual = stateHistory.length;

      if (stateHistory.length < stateHistoryRedo.length) {
        state = stateHistoryRedo[atual];  
        stateHistory = [...stateHistory, state];  
        return state
      } 

    default:
      return state
  }
}
