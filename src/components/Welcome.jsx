import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../store/AuthContext';
import ProfileIncomplete from './ProfileIncomplete';
import 'bootstrap/dist/css/bootstrap.min.css';

const Welcome = () => {
  const authCtx = useContext(AuthContext);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [expenseData, setExpenseData] = useState({
    amount: '',
    description: '',
    category: 'Food',
  });

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
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [authCtx.token, authCtx]);

  const fetchExpenses = async () => {
    if (!authCtx.token) return;

    try {
      const response = await fetch(
        `https://expensetracker-ec86d-default-rtdb.firebaseio.com/expenses.json?auth=${authCtx.token}`
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
    fetchExpenses();
  }, [authCtx.token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://expensetracker-ec86d-default-rtdb.firebaseio.com/expenses.json?auth=${authCtx.token}`,
        {
          method: 'POST',
          body: JSON.stringify(expenseData),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to store expense.');
      }

      const data = await response.json();
      const newExpense = { id: data.name, ...expenseData };
      setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
      setExpenseData({ amount: '', description: '', category: 'Food' });
    } catch (error) {
      console.error('Error storing expense:', error);
    }
  };

  return (
    <section className="container mt-5">
      <h1 className='mb-4 text-center bg-danger text-white p-3 rounded'>Welcome to Expense Tracker</h1>
      {!isProfileComplete ? <ProfileIncomplete /> : <p className="alert alert-success">Profile is complete!</p>}
      {!authCtx.isEmailVerified && (
        <>
          {!verificationSent && <button className="btn btn-primary mb-3" onClick={sendVerificationEmail}>Verify Email</button>}
          {verificationSent && <p className="alert alert-success">Verification email sent successfully. Please check your inbox.</p>}
          {verificationError && <p className="alert alert-danger">{verificationError}</p>}
        </>
      )}
      {authCtx.isEmailVerified && <p className="alert alert-success">Your email is verified.</p>}

      {authCtx.isLoggedIn && (
        <>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">Amount Spent:</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={expenseData.amount}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description:</label>
              <input
                type="text"
                id="description"
                name="description"
                value={expenseData.description}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category:</label>
              <select
                id="category"
                name="category"
                value={expenseData.category}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="Food">Food</option>
                <option value="Petrol">Petrol</option>
                <option value="Salary">Salary</option>
                <option value="other">other</option>
                
              </select>
            </div>
            <button type="submit" className="btn btn-success">Add Expense</button>
          </form>
          <h2 className="mb-3">Expenses</h2>
          <ul className="list-group">
            {expenses.map((expense) => (
              <li key={expense.id} className="list-group-item">
                {expense.amount} - {expense.description} - {expense.category}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};

export default Welcome;
