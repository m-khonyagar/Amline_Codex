import { createContext, useContext, useReducer } from 'react'

const initialState = {
  clauses: [],
  selectedClause: null,
  selectedSubClause: null,
  selectedForDelete: null,
}

const ClauseContext = createContext()

const ActionTypes = {
  SET_CLAUSES: 'SET_CLAUSES',
  ADD_CLAUSE: 'ADD_CLAUSE',
  UPDATE_CLAUSE: 'UPDATE_CLAUSE',
  REMOVE_CLAUSE: 'REMOVE_CLAUSE',
  SET_SUBCLAUSES: 'SET_SUBCLAUSES',
  ADD_SUBCLAUSE: 'ADD_SUBCLAUSE',
  UPDATE_SUBCLAUSE: 'UPDATE_SUBCLAUSE',
  REMOVE_SUBCLAUSE: 'REMOVE_SUBCLAUSE',
  SELECT_CLAUSE: 'SELECT_CLAUSE',
  SELECT_SUBCLAUSE: 'SELECT_SUBCLAUSE',
  SELECT_FOR_DELETE: 'SELECT_FOR_DELETE',
}

const clauseReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_CLAUSES:
      return { ...state, clauses: action.payload }

    case ActionTypes.ADD_CLAUSE:
      return {
        ...state,
        clauses: [...state.clauses, action.payload],
      }

    case ActionTypes.UPDATE_CLAUSE:
      return {
        ...state,
        clauses: state.clauses.map((clause) =>
          clause.id === action.payload.id ? action.payload : clause
        ),
      }

    case ActionTypes.REMOVE_CLAUSE:
      return {
        ...state,
        clauses: state.clauses
          .filter((clause) => clause.id !== action.payload)
          .map((item, i) => ({
            ...item,
            clause_number: i + 6,
          })),
        selectedClauseId: state.selectedClauseId === action.payload ? null : state.selectedClauseId,
      }

    case ActionTypes.SET_SUBCLAUSES: {
      const { clauseId, subclauses } = action.payload
      return {
        ...state,
        clauses: state.clauses.map((clause) => {
          if (clause.id === clauseId) {
            return {
              ...clause,
              subclauses: subclauses,
            }
          }
          return clause
        }),
      }
    }

    case ActionTypes.ADD_SUBCLAUSE: {
      const { clauseId, subclause } = action.payload
      return {
        ...state,
        clauses: state.clauses.map((clause) => {
          if (clause.id === clauseId) {
            return {
              ...clause,
              subclauses: [...clause.subclauses, subclause],
            }
          }
          return clause
        }),
      }
    }

    case ActionTypes.UPDATE_SUBCLAUSE: {
      const { clauseId, subclause } = action.payload
      return {
        ...state,
        clauses: state.clauses.map((clause) => {
          if (clause.id === clauseId) {
            return {
              ...clause,
              subclauses: clause.subclauses.map((sc) => (sc.id === subclause.id ? subclause : sc)),
            }
          }
          return clause
        }),
      }
    }

    case ActionTypes.REMOVE_SUBCLAUSE: {
      const { clauseId, subclauseId } = action.payload
      return {
        ...state,
        clauses: state.clauses.map((clause) => {
          if (clause.id === clauseId) {
            return {
              ...clause,
              subclauses: clause.subclauses
                .filter((sc) => sc.id !== subclauseId)
                .map((item, i) => ({
                  ...item,
                  subclause_number: i + 1,
                })),
            }
          }
          return clause
        }),
      }
    }

    case ActionTypes.SELECT_CLAUSE: {
      return { ...state, selectedClause: action.payload }
    }

    case ActionTypes.SELECT_SUBCLAUSE: {
      return { ...state, selectedSubClause: action.payload }
    }

    case ActionTypes.SELECT_FOR_DELETE: {
      return { ...state, selectedForDelete: action.payload }
    }

    default:
      return state
  }
}

export const ClauseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(clauseReducer, initialState)

  const actions = {
    setClauses: (clauses) => {
      dispatch({ type: ActionTypes.SET_CLAUSES, payload: clauses })
    },

    addClause: (clause) => {
      const newClause = {
        ...clause,
        id: clause.id || Date.now().toString(),
        subclauses: clause.subclauses || [],
      }
      dispatch({ type: ActionTypes.ADD_CLAUSE, payload: newClause })
      return newClause
    },

    updateClause: (clause) => {
      dispatch({ type: ActionTypes.UPDATE_CLAUSE, payload: clause })
    },

    removeClause: (clauseId) => {
      dispatch({ type: ActionTypes.REMOVE_CLAUSE, payload: clauseId })
    },

    setSubClauses: (clauseId, subclauses) => {
      dispatch({
        type: ActionTypes.SET_SUBCLAUSES,
        payload: { clauseId, subclauses },
      })
    },

    addSubclause: (clauseId, subclause) => {
      const newSubclause = {
        ...subclause,
        id: subclause.id || Date.now().toString(),
      }

      dispatch({
        type: ActionTypes.ADD_SUBCLAUSE,
        payload: { clauseId, subclause: newSubclause },
      })

      return newSubclause
    },

    updateSubclause: (clauseId, subclause) => {
      dispatch({
        type: ActionTypes.UPDATE_SUBCLAUSE,
        payload: { clauseId, subclause },
      })
    },

    removeSubclause: (clauseId, subclauseId) => {
      dispatch({
        type: ActionTypes.REMOVE_SUBCLAUSE,
        payload: { clauseId, subclauseId },
      })
    },

    selectClause: (id) => dispatch({ type: ActionTypes.SELECT_CLAUSE, payload: id }),

    selectSubClause: (id) => dispatch({ type: ActionTypes.SELECT_SUBCLAUSE, payload: id }),

    selectForDelete: (id) => dispatch({ type: ActionTypes.SELECT_FOR_DELETE, payload: id }),

    // Helper functions
    getClause: (clauseId) => {
      return state.clauses.find((clause) => clause.id === clauseId)
    },

    getSubclause: (clauseId, subclauseId) => {
      const clause = state.clauses.find((clause) => clause.id === clauseId)
      if (!clause) return null
      return clause.subclauses.find((sc) => sc.id === subclauseId)
    },
  }

  return (
    <ClauseContext.Provider value={{ state, dispatch, actions }}>{children}</ClauseContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useClauseContext = () => {
  const context = useContext(ClauseContext)
  if (context === undefined) {
    throw new Error('useClauseContext must be used within a ClauseProvider')
  }
  return context
}
