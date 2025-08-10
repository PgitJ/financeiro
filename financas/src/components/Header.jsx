// src/components/Header.jsx - CÓDIGO COMPLETO E CORRIGIDO

import React from 'react';
import { formatCurrency } from '../utils/formatters';

const Header = ({ username, balance, onLogout, onAddTransactionClick }) => {
  return (
    <header>
      <h1>Finanças Pessoal</h1>
      <div className="header-actions">
        <button className="add-transaction-button" onClick={onAddTransactionClick}>+ Adicionar Transação</button>
      </div>
      <div className="header-user-info">
        <div className="user-info">
          <span>Olá, {username}</span>
          <button className="logout-button" onClick={onLogout}>Sair</button>
        </div>
        <div className="balance-info">
          <p>Saldo Atual:</p>
          <p>{formatCurrency(balance)}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
