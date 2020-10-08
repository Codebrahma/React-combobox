type FocusStateType = {
  isFocus: boolean
  focusIndex: number
}

type Action =
  | { type: 'setFocusIndex'; focusIndex: number }
  | { type: 'toggleFocus'; isFocus: boolean }

const initialState: FocusStateType = {
  isFocus: false,
  focusIndex: -1
}

const focusReducer = (state: FocusStateType, action: Action) => {
  switch (action.type) {
    case 'setFocusIndex':
      return { ...state, focusIndex: action.focusIndex }
    case 'toggleFocus':
      return { ...state, isFocus: action.isFocus }
    default:
      return state
  }
}

export { initialState, focusReducer }
