export const combineReducers = slices => (prevState, action) =>
  // I like to use array.reduce, you can also just write a for..in loop
  Object.keys(slices).reduce(
    (nextState, nextProp) => ({
      ...nextState,
      [nextProp]: slices[nextProp](prevState[nextProp], action)
    }),
    prevState
  )
