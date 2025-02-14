import React, { useState } from 'react';
import { WalletCards, Receipt, CalendarClock } from 'lucide-react';

type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
};

type Subscription = {
  id: string;
  name: string;
  amount: number;
  billingCycle: string;
  nextPayment: string;
};

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const addExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description: formData.get('description') as string,
      amount: parseFloat(formData.get('amount') as string),
      category: formData.get('category') as string,
      date: new Date().toISOString().split('T')[0],
    };

    setExpenses(prev => [...prev, newExpense]);
    form.reset();
  };

  const addSubscription = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const newSubscription: Subscription = {
      id: crypto.randomUUID(),
      name: formData.get('name') as string,
      amount: parseFloat(formData.get('amount') as string),
      billingCycle: formData.get('billingCycle') as string,
      nextPayment: formData.get('nextPayment') as string,
    };

    setSubscriptions(prev => [...prev, newSubscription]);
    form.reset();
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSubscriptions = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <WalletCards className="h-6 w-6" />
            Gerenciador Financeiro
          </h1>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resumo Financeiro */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Resumo Financeiro</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm text-gray-600">Total de Despesas</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {totalExpenses.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <p className="text-sm text-gray-600">Total de Assinaturas</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalSubscriptions.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Adicionar Nova Despesa */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Adicionar Despesa
            </h2>
            <form onSubmit={addExpense}>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  name="description"
                  placeholder="Descrição"
                  required
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  name="amount"
                  placeholder="Valor"
                  step="0.01"
                  required
                  className="w-full p-2 border rounded"
                />
                <select
                  name="category"
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Moradia">Moradia</option>
                  <option value="Lazer">Lazer</option>
                  <option value="Outros">Outros</option>
                </select>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Adicionar Despesa
                </button>
              </div>
            </form>
          </div>

          {/* Lista de Despesas */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Últimas Despesas</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
                      <td className="px-6 py-4">{expense.description}</td>
                      <td className="px-6 py-4">{expense.category}</td>
                      <td className="px-6 py-4">R$ {expense.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gerenciar Assinaturas */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              Gerenciar Assinaturas
            </h2>
            <form onSubmit={addSubscription} className="mb-6">
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Nome da Assinatura"
                  required
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  name="amount"
                  placeholder="Valor Mensal"
                  step="0.01"
                  required
                  className="w-full p-2 border rounded"
                />
                <select
                  name="billingCycle"
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="Mensal">Mensal</option>
                  <option value="Anual">Anual</option>
                  <option value="Semestral">Semestral</option>
                </select>
                <input
                  type="date"
                  name="nextPayment"
                  required
                  className="w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  Adicionar Assinatura
                </button>
              </div>
            </form>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ciclo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Próximo Pagamento
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id}>
                      <td className="px-6 py-4">{sub.name}</td>
                      <td className="px-6 py-4">R$ {sub.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">{sub.billingCycle}</td>
                      <td className="px-6 py-4">{sub.nextPayment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;