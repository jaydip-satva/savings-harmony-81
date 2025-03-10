
import api from './apiService';

// Get all transactions for a user
export const getUserTransactions = async (userId) => {
  try {
    const transactions = await api.get(`/transactions/${userId}`);
    return transactions || [];
  } catch (error) {
    console.error('Error getting transactions', error);
    return [];
  }
};

// Add a new transaction
export const addTransaction = async (userId, transaction) => {
  try {
    const existingTransactions = await getUserTransactions(userId);
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const updatedTransactions = [...existingTransactions, newTransaction];
    await api.put(`/transactions/${userId}`, updatedTransactions);
    return newTransaction;
  } catch (error) {
    console.error('Error adding transaction', error);
    throw error;
  }
};

// Update an existing transaction
export const updateTransaction = async (userId, transaction) => {
  try {
    const transactions = await getUserTransactions(userId);
    const index = transactions.findIndex(t => t.id === transaction.id);
    
    if (index !== -1) {
      transactions[index] = {
        ...transactions[index],
        ...transaction,
        updatedAt: new Date().toISOString()
      };
      
      await api.put(`/transactions/${userId}`, transactions);
      return transactions[index];
    }
    
    return null;
  } catch (error) {
    console.error('Error updating transaction', error);
    throw error;
  }
};

// Delete a transaction
export const deleteTransaction = async (userId, transactionId) => {
  try {
    const transactions = await getUserTransactions(userId);
    const filtered = transactions.filter(t => t.id !== transactionId);
    await api.put(`/transactions/${userId}`, filtered);
    return true;
  } catch (error) {
    console.error('Error deleting transaction', error);
    throw error;
  }
};

// Get transactions by category
export const getTransactionsByCategory = async (userId) => {
  try {
    const transactions = await getUserTransactions(userId);
    return transactions.reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(transaction);
      return acc;
    }, {});
  } catch (error) {
    console.error('Error getting transactions by category', error);
    return {};
  }
};

// Get transactions total by type (income/expense)
export const getTransactionsTotalByType = async (userId) => {
  try {
    const transactions = await getUserTransactions(userId);
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += parseFloat(transaction.amount);
        } else {
          acc.expense += parseFloat(transaction.amount);
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );
  } catch (error) {
    console.error('Error getting transaction totals', error);
    return { income: 0, expense: 0 };
  }
};

// Get transactions by month
export const getTransactionsByMonth = async (userId) => {
  try {
    const transactions = await getUserTransactions(userId);
    return transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = { income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        acc[monthYear].income += parseFloat(transaction.amount);
      } else {
        acc[monthYear].expense += parseFloat(transaction.amount);
      }
      
      return acc;
    }, {});
  } catch (error) {
    console.error('Error getting transactions by month', error);
    return {};
  }
};
