import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { saveAs } from 'file-saver';

const ExpenseList = ({ expenses, onDeleteExpense, onEditExpense, onActivatePremium }) => {
  const totalExpenses = expenses.reduce((total, expense) => total + parseInt(expense.amount), 0);

  const handleDownload = () => {
    const csvContent = 'Description,Category,Amount\n' + expenses.map(expense => `${expense.description},${expense.category},${expense.amount}`).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'expenses.csv');
    document.body.appendChild(link);
    
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  

  return (
    <>
      {totalExpenses > 10000 && (
        <button onClick={onActivatePremium} className="btn btn-success mt-3 mb-3 float-end">
          Activate Premium
        </button>
      )}
      <button onClick={handleDownload} className="btn btn-secondary mb-3 float-end">
        Download CSV
      </button>
      <div className='border w-100 m-auto'>
        <h2 className='text-center mb-0'>Expenses</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th className='bg-success text-white'>Description</th>
              <th className='bg-success text-white'>Category</th>
              <th className='bg-success text-white'>Amount</th>
              <th className='bg-success text-white'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.description}</td>
                <td>{expense.category}</td>
                <td>{expense.amount}</td>
                <td>
                  <button
                    onClick={() => onEditExpense(expense)}
                    className="btn btn-primary btn-sm mr-10"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="btn btn-danger btn-sm ml-5"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-right font-weight-bold bg-success text-white">
                Total Expenses Amount
              </td>
              <td className="font-weight-bold bg-success text-white border text-center">{totalExpenses}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default ExpenseList;
