
// Simple service for CRUD operations on transactions using local storage

const TRANSACTIONS_KEY = 'transactions';

// Helper to get transactions from localStorage
const getTransactions = (userId) => {
  try {
    const allTransactions = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '{}');
    return allTransactions[userId] || [];
  } catch (error) {
    console.error('Error getting transactions', error);
    return [];
  }
};

// Helper to save transactions to localStorage
const saveTransactions = (userId, transactions) => {
  try {
    const allTransactions = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '{}');
    allTransactions[userId] = transactions;
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(allTransactions));
  } catch (error) {
    console.error('Error saving transactions', error);
  }
};

// Get all transactions for a user
export const getUserTransactions = (userId) => {
  return getTransactions(userId);
};

// Add a new transaction
export const addTransaction = (userId, transaction) => {
  const transactions = getTransactions(userId);
  const newTransaction = {
    ...transaction,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  transactions.push(newTransaction);
  saveTransactions(userId, transactions);
  return newTransaction;
};

// Update an existing transaction
export const updateTransaction = (userId, transaction) => {
  const transactions = getTransactions(userId);
  const index = transactions.findIndex(t => t.id === transaction.id);
  
  if (index !== -1) {
    transactions[index] = {
      ...transactions[index],
      ...transaction,
      updatedAt: new Date().toISOString()
    };
    saveTransactions(userId, transactions);
    return transactions[index];
  }
  
  return null;
};

// Delete a transaction
export const deleteTransaction = (userId, transactionId) => {
  const transactions = getTransactions(userId);
  const filtered = transactions.filter(t => t.id !== transactionId);
  saveTransactions(userId, filtered);
  return true;
};

// Get transactions by category
export const getTransactionsByCategory = (userId) => {
  const transactions = getTransactions(userId);
  return transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(transaction);
    return acc;
  }, {});
};

// Get transactions total by type (income/expense)
export const getTransactionsTotalByType = (userId) => {
  const transactions = getTransactions(userId);
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
};

// Get transactions by month
export const getTransactionsByMonth = (userId) => {
  const transactions = getTransactions(userId);
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
};
