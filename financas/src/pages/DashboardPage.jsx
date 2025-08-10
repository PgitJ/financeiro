// src/pages/DashboardPage.jsx

import React from 'react';
import Summary from '../components/Summary';
import Chart from '../components/Chart';
import TransactionList from '../components/TransactionList';

const DashboardPage = ({ transactions, onEditClick, onDeleteTransaction }) => { // Recebe a nova prop
  return (
    <div>
      <Summary transactions={transactions} />
      <hr />
      <Chart transactions={transactions} />
      <hr />
      <TransactionList
        transactions={transactions}
        onEditClick={onEditClick}
        onDeleteTransaction={onDeleteTransaction} // Passa a função para a lista
      />
    </div>
  );
};

export default DashboardPage;