import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExpenseForm = ({ onAddExpense, editingExpense, onEditExpense }) => {
  const [expenseData, setExpenseData] = useState({
    amount: '',
    description: '',
    category: 'Food',
  });

  useEffect(() => {
    if (editingExpense) {
      setExpenseData(editingExpense);
    }
  }, [editingExpense]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingExpense) {
      onEditExpense({ ...expenseData, id: editingExpense.id });
    } else {
      onAddExpense(expenseData);
    }
    setExpenseData({ amount: '', description: '', category: 'Food' });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="form-group">
        <label htmlFor="amount">Amount Spent:</label>
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
      <div className="form-group">
        <label htmlFor="description">Description:</label>
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
      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          value={expenseData.category}
          onChange={handleInputChange}
          className="form-control"
        >
          <option value="Food">Food</option>
          <option value="Petrol">Petrol</option>
          <option value="Salary">Salary</option>
          <option value="other">Other</option>
        </select>
      </div>
      <button type="submit" className="btn btn-success mt-3">
        {editingExpense ? 'Update Expense' : 'Add Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;
