import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExpenseList = ({ expenses, onDeleteExpense, onEditExpense }) => {
  return (
    <div>
      <h2>Expenses</h2>
      <ul className="list-group">
        {expenses.map((expense) => (
          <li key={expense.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              {expense.amount} - {expense.description} - {expense.category}
            </div>
            <div>
              <button onClick={() => onEditExpense(expense)} className="btn btn-primary btn-sm mr-2">Edit</button>
              <button onClick={() => onDeleteExpense(expense.id)} className="btn btn-danger btn-sm">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
