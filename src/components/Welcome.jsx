import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../store/AuthContext';
import ProfileIncomplete from './ProfileIncomplete';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import 'bootstrap/dist/css/bootstrap.min.css';

const Welcome = () => {
  const authCtx = useContext(AuthContext);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  const sendVerificationEmail = async () => {
    setVerificationSent(false);
    setVerificationError(null);

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCcErHXDGkKboWX0RyiBeUrz1T2YaYHx-M`,
        {
          method: 'POST',
          body: JSON.stringify({
            requestType: 'VERIFY_EMAIL',
            idToken: authCtx.token,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        let errorMessage = 'Failed to send verification email.';
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Verification email sent successfully', data);
      setVerificationSent(true);
    } catch (err) {
      setVerificationError(err.message);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!authCtx.token) return;

      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCcErHXDGkKboWX0RyiBeUrz1T2YaYHx-M`,
          {
            method: 'POST',
            body: JSON.stringify({ idToken: authCtx.token }),
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch profile data.');
        }

        const data = await response.json();
        const userProfile = data.users[0];
        authCtx.setUserProfile(userProfile);
        setIsProfileComplete(!!userProfile.displayName && !!userProfile.photoUrl);
        authCtx.setUserId(userProfile.localId);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [authCtx.token, authCtx]);

  const fetchExpenses = async () => {
    if (!authCtx.token || !authCtx.userId) return;

    try {
      const response = await fetch(
        `https://expensetracker-ec86d-default-rtdb.firebaseio.com/users/${authCtx.userId}/expenses.json?auth=${authCtx.token}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch expenses.');
      }

      const data = await response.json();
      const loadedExpenses = [];

      for (const key in data) {
        loadedExpenses.push({
          id: key,
          ...data[key],
        });
      }

      setExpenses(loadedExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
    if (authCtx.userId) {
      fetchExpenses();
    }
  }, [authCtx.token, authCtx.userId]);

  const handleAddExpense = async (expense) => {
    try {
      const response = await fetch(
        `https://expensetracker-ec86d-default-rtdb.firebaseio.com/users/${authCtx.userId}/expenses.json?auth=${authCtx.token}`,
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
      setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    } catch (error) {
      console.error('Error storing expense:', error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(
        `https://expensetracker-ec86d-default-rtdb.firebaseio.com/users/${authCtx.userId}/expenses/${id}.json?auth=${authCtx.token}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete expense.');
      }

      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
      console.log('Expense successfully deleted');
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
  };

  const handleUpdateExpense = async (updatedExpense) => {
    try {
      const response = await fetch(
        `https://expensetracker-ec86d-default-rtdb.firebaseio.com/users/${authCtx.userId}/expenses/${updatedExpense.id}.json?auth=${authCtx.token}`,
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

      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === updatedExpense.id ? updatedExpense : expense
        )
      );
      setEditingExpense(null);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  return (
    <section>
      <h1 className="mt-5 bg-danger text-white p-3">Welcome to Expense Tracker</h1>
      {!isProfileComplete ? <ProfileIncomplete /> : <p>Profile is complete!</p>}
      {!authCtx.isEmailVerified && (
        <>
          {!verificationSent && <button onClick={sendVerificationEmail} className="btn btn-primary">Verify Email</button>}
          {verificationSent && <p>Verification email sent successfully. Please check your inbox.</p>}
          {verificationError && <p>{verificationError}</p>}
        </>
      )}
      {authCtx.isEmailVerified && <p>Your email is verified.</p>}

      {authCtx.isLoggedIn && (
        <>
          <ExpenseForm
            onAddExpense={handleAddExpense}
            editingExpense={editingExpense}
            onEditExpense={handleUpdateExpense}
          />
          <ExpenseList
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
            onEditExpense={handleEditExpense}
          />
        </>
      )}
    </section>
  );
};

export default Welcome;
