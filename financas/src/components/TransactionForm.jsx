// src/components/TransactionForm.jsx - COMPLETO E CORRIGIDO

import React, { useState, useEffect } from 'react';
import './TransactionForm.css';

const TransactionForm = ({ onSubmit, onCancel, transactionToEdit, onDeleteRequest }) => {
  const [id, setId] = useState(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Despesa');
  const [category, setCategory] = useState('Alimentação');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (transactionToEdit) {
      setId(transactionToEdit.id);
      setDescription(transactionToEdit.description);
      setAmount(Math.abs(transactionToEdit.amount));
      setType(transactionToEdit.amount < 0 ? 'Despesa' : 'Receita');
      setCategory(transactionToEdit.category);
      setDate(transactionToEdit.date);
    } else {
      setId(null);
      setDescription('');
      setAmount('');
      setType('Despesa');
      setCategory('Alimentação');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [transactionToEdit]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      id,
      description,
      amount,
      type,
      category,
      date,
    };
    onSubmit(formData);
  };
  
  const handleDelete = () => {
    if (id) {
        onDeleteRequest(id); // Chama a função que abre o modal
    }
  };

  return (
    <div className="form-container">
      <h2>{transactionToEdit ? 'Editar Transação' : 'Adicionar Nova Transação'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Descrição:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Valor:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tipo:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Receita">Receita</option>
            <option value="Despesa">Despesa</option>
          </select>
        </div>
        <div>
          <label>Categoria:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Alimentação">Alimentação</option>
            <option value="Salário">Salário</option>
            <option value="Transporte">Transporte</option>
            <option value="Lazer">Lazer</option>
            <option value="Saúde">Saúde</option>
            <option value="Moradia">Moradia</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        <div>
          <label>Data:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">{transactionToEdit ? 'Salvar Alterações' : 'Adicionar'}</button>
          <button type="button" onClick={onCancel} className="cancel-button">Cancelar</button>
          {transactionToEdit && (
            <button type="button" onClick={handleDelete} className="delete-button">Apagar</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;