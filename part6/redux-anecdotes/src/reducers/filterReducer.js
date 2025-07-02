export const setFilter = (filter) => {
  return {
    type: 'SET_FILTER',
    payload: { filter }
  }
}

export const clearFilter = () => {
    return {
        type: 'CLEAR_FILTER'
    }
}

const filterReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.payload.filter;
    case 'CLEAR_FILTER':
      return '';
    default:
      return state;
  }
}

export default filterReducer;