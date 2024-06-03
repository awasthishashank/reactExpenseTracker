import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, sendVerificationEmail } from '../store/authSlice';
import { fetchExpenses, addExpense, deleteExpense, updateExpense } from '../store/expensesSlice';
import { toggleTheme } from '../store/themeSlice'; // Import the toggleTheme action
import ProfileIncomplete from './ProfileIncomplete';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_KEY = 'AIzaSyCcErHXDGkKboWX0RyiBeUrz1T2YaYHx-M';

const Welcome = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const expenses = useSelector((state) => state.expenses.expenses);
  const theme = useSelector((state) => state.theme); // Get the current theme
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    if (!auth.token) return;

    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
          {
            method: 'POST',
            body: JSON.stringify({ idToken: auth.token }),
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch profile data.');
        }

        const data = await response.json();
        const userProfile = data.users[0];
        dispatch(authActions.setUserProfile(userProfile));
        setIsProfileComplete(!!userProfile.displayName && !!userProfile.photoUrl);
        dispatch(authActions.setUserId(userProfile.localId));
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [auth.token, dispatch]);

  useEffect(() => {
    if (auth.userId) {
      dispatch(fetchExpenses(auth.token, auth.userId));
    }
  }, [auth.token, auth.userId, dispatch]);

  const handleAddExpense = async (expense) => {
    try {
      const response = await fetch(
        `https://expensetracker-ec86d-default-rtdb.firebaseio.com/users/${auth.userId}/expenses.json?auth=${auth.token}`,
        {
          method: 'POST',
          body: JSON.stringify(expense),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to store expense.');
      }

      const data = await response.json();
      const newExpense = { id: data.name, ...expense };
      dispatch(addExpense(newExpense));
    } catch (error) {
      console.error('Error storing expense:', error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(
        `https://expensetracker-ec86d-default-rtdb.firebaseio.com/users/${auth.userId}/expenses/${id}.json?auth=${auth.token}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete expense.');
      }

      dispatch(deleteExpense(id));
      console.log('Expense successfully deleted');
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleUpdateExpense = async (updatedExpense) => {
    try {
      const response = await fetch(
        `https://expensetracker-ec86d-default-rtdb.firebaseio.com/users/${auth.userId}/expenses/${updatedExpense.id}.json?auth=${auth.token}`,
        {
          method: 'PUT',
          body: JSON.stringify(updatedExpense),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update expense.');
      }

      dispatch(updateExpense(updatedExpense));
      setEditingExpense(null);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleSendVerificationEmail = async () => {
    try {
      await sendVerificationEmail(auth.token, API_KEY);
      setVerificationSent(true);
      setVerificationError(null);
    } catch (error) {
      setVerificationError('Failed to send verification email.');
      console.error(error);
    }
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <section className={theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}>
      <h1 className="p-3 text-center">Welcome to Expense Tracker</h1>
      <button onClick={handleToggleTheme} className="btn btn-secondary mb-3">
        Toggle Theme
      </button>
      {!isProfileComplete ? <ProfileIncomplete /> : <p>Profile is complete!</p>}
      {!auth.isEmailVerified && (
        <>
          {!verificationSent && (
            <button onClick={handleSendVerificationEmail} className="btn btn-primary">
              Verify Email
            </button>
          )}
          {verificationSent && <p>Verification email sent successfully. Please check your inbox.</p>}
          {verificationError && <p>{verificationError}</p>}
        </>
      )}
      {auth.isEmailVerified && <p>Your email is verified.</p>}

      {auth.isLoggedIn && (
        <>
          <ExpenseForm
            onAddExpense={handleAddExpense}
            editingExpense={editingExpense}
            onEditExpense={handleUpdateExpense}
          />
          <ExpenseList
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
            onEditExpense={setEditingExpense}
            onActivatePremium={() => alert('Premium Activated')} // Placeholder for premium activation
          />
        </>
      )}
    </section>
  );
};

export default Welcome;
