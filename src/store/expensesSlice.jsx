import { createSlice } from '@reduxjs/toolkit';
import { authActions } from './authSlice'; // If authActions are required for other purposes

// Define your initial state
const initialExpensesState = {
  expenses: [],
  loading: false,
  error: null,
  isPremium: false, 
};

// Create a slice
const expensesSlice = createSlice({
  name: 'expenses',
  initialState: initialExpensesState,
  reducers: {
    setExpenses(state, action) {
      state.expenses = action.payload;
      state.loading = false;
      state.error = null;
    },
    addExpense(state, action) {
      state.expenses.push(action.payload);
      if (state.expenses.reduce((sum, expense) => sum + expense.amount, 0) >= 10000) {
        state.isPremium = true; // Activate premium if expenses exceed 10000
      }
    },
    deleteExpense(state, action) {
      state.expenses = state.expenses.filter(expense => expense.id !== action.payload);
    },
    updateExpense(state, action) {
      const index = state.expenses.findIndex(expense => expense.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    activatePremium(state) { // Add this line
      state.isPremium = true;
    },
  },
});

// Export actions
export const {
  setExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
  setLoading,
  setError,
  activatePremium,
} = expensesSlice.actions;

// Reducer
export default expensesSlice.reducer;

// Thunk action to fetch expenses
export const fetchExpenses = () => async (dispatch, getState) => {
  const { token, userId } = getState().auth;

  dispatch(setLoading(true));

  try {
    const response = await fetch(`https://expensetracker-ec86d-default-rtdb.firebaseio.com/users/${userId}/expenses.json?auth=${token}`);

    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }

    const data = await response.json();
    const expenses = Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));

    dispatch(setExpenses(expenses));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};
