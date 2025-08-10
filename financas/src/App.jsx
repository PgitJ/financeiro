import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import BillsPage from './pages/BillsPage';
import TransactionForm from './components/TransactionForm';
import ConfirmModal from './components/ConfirmModal';
import Auth from './components/Auth';

const API_URL = 'http://localhost:5000/api';
const AUTH_URL = 'http://localhost:5000/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [goals, setGoals] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
    const response = await fetch(url, { ...options, headers });
    return response;
  };

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const [transactionsResponse, goalsResponse, billsResponse] = await Promise.all([
        fetchWithAuth(`${API_URL}/transactions`),
        fetchWithAuth(`${API_URL}/goals`),
        fetchWithAuth(`${API_URL}/bills`),
      ]);

      if (!transactionsResponse.ok || !goalsResponse.ok || !billsResponse.ok) {
        throw new Error('Erro ao buscar dados do backend.');
      }

      const transactionsData = await transactionsResponse.json();
      const goalsData = await goalsResponse.json();
      const billsData = await billsResponse.json();

      const formattedTransactions = transactionsData.map(t => ({
        ...t,
        amount: parseFloat(t.amount),
        date: t.date.split('T')[0]
      }));

      const formattedGoals = goalsData.map(g => ({
        ...g,
        amount: parseFloat(g.amount),
        saved: parseFloat(g.saved),
        target_date: g.target_date?.split('T')[0]
      }));

      const formattedBills = billsData.map(b => ({
        ...b,
        amount: parseFloat(b.amount),
        due_date: b.due_date?.split('T')[0]
      }));

      setTransactions(formattedTransactions);
      setGoals(formattedGoals);
      setBills(formattedBills);
      setLoading(false);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setUsername(user.username);
    localStorage.setItem('username', user.username);
    fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
  };

  const currentBalance = transactions.reduce((total, t) => total + t.amount, 0);

  const handleAddTransactionClick = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };
  
  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    const finalAmount = formData.type === 'Despesa' ? -Math.abs(formData.amount) : Math.abs(formData.amount);
    const transactionData = { ...formData, amount: finalAmount };

    try {
      const method = editingTransaction ? 'PUT' : 'POST';
      const url = editingTransaction ? `${API_URL}/transactions/${transactionData.id}` : `${API_URL}/transactions`;
      
      const response = await fetchWithAuth(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.error || 'Erro na requisição da transação');
      }

      fetchData();
      setShowForm(false);
      setEditingTransaction(null);
    } catch (err) {
      setError(err.message);
      setShowForm(false);
      setEditingTransaction(null);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/transactions/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao apagar a transação');
      fetchData();
    } catch (err) { setError(err.message); }
  };
  
  const handleDeleteRequest = (transactionId) => {
    setTransactionToDelete(transactionId);
    setShowForm(false);
  };

  const handleConfirmDelete = () => {
    handleDeleteTransaction(transactionToDelete);
    setTransactionToDelete(null);
  };

  const handleCancelDelete = () => {
    setTransactionToDelete(null);
  };

  const handleAddGoal = async (newGoalData) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoalData),
      });
      if (!response.ok) throw new Error('Erro ao adicionar meta');
      fetchData();
    } catch (err) { setError(err.message); }
  };

  const handleUpdateGoal = async (goalId, amountToAdd) => {
    const goalToUpdate = goals.find(g => g.id === goalId);
    if (!goalToUpdate) return;
    const updatedGoal = { ...goalToUpdate, saved: parseFloat(goalToUpdate.saved) + parseFloat(amountToAdd) };
    try {
      const response = await fetchWithAuth(`${API_URL}/goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGoal),
      });
      if (!response.ok) throw new Error('Erro ao atualizar meta');
      fetchData();
    } catch (err) { setError(err.message); }
  };

  const handleDeleteGoal = async (goalId) => {
      try {
        const response = await fetchWithAuth(`${API_URL}/goals/${goalId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao apagar meta');
        fetchData();
      } catch (err) { setError(err.message); }
    };

  const handleAddBill = async (newBillData) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBillData),
      });
      if (!response.ok) throw new Error('Erro ao adicionar conta');
      fetchData();
    } catch (err) { setError(err.message); }
  };

  const handleMarkAsPaid = async (billId) => {
    const billToUpdate = bills.find(b => b.id === billId);
    if (!billToUpdate) return;
    const updatedBill = { ...billToUpdate, paid: true };
    try {
      const response = await fetchWithAuth(`${API_URL}/bills/${billId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBill),
      });
      if (!response.ok) throw new Error('Erro ao marcar conta como paga');
      fetchData();
    } catch (err) { setError(err.message); }
  };

  const handleDeleteBill = async (billId) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/bills/${billId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao apagar conta');
      fetchData();
    } catch (err) { setError(err.message); }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  if (!isAuthenticated) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Router>
      <div>
        <Header username={username} onAddTransactionClick={handleAddTransactionClick} balance={currentBalance} onLogout={handleLogout} />
        {showForm && (
          <div className="modal-overlay">
            <TransactionForm
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
              transactionToEdit={editingTransaction}
              onDeleteRequest={handleDeleteRequest}
            />
          </div>
        )}
        {transactionToDelete && (
          <ConfirmModal
            message={`Tem certeza que deseja apagar esta transação?`}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
        <nav style={{ padding: '20px' }}>
          <Link to="/">Dashboard</Link> | <Link to="/goals">Metas</Link> | <Link to="/bills">Contas</Link>
        </nav>
        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<DashboardPage
              transactions={transactions}
              onEditClick={handleEditClick}
            />} />
            <Route path="/goals" element={<GoalsPage
              goals={goals}
              onAddGoal={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={handleDeleteGoal}
            />} />
            <Route path="/bills" element={<BillsPage
              bills={bills}
              onAddBill={handleAddBill}
              onMarkAsPaid={handleMarkAsPaid}
              onDeleteBill={handleDeleteBill}
            />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
