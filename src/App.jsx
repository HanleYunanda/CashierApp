// import { useState } from 'react'
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import MainLayout from './page/MainLayout'
import WelcomePage from './page/WelcomePage'
import CashierPage from './page/Cashier/CashierPage'
import Login from './page/Login/Login'
import Auth from './page/Auth'
import CreateTransactionPage from './page/Transaction/CreateTransactionPage'
import ListProductPage from './page/Product/ListProductPage'
import EditPage from './page/Product/EditPage'
import CreatePage from './page/Product/CreatePage'
import TransactionReportPage from './page/Transaction/TransactionReportPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <WelcomePage />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        element: <Auth />,
        children: [
          {
            path: '/cashier',
            element: <CashierPage />,
            // loader: loadProducts
          },
          {
            path: '/transaction',
            children: [
              {
                index: true,
                element: <CreateTransactionPage />,
              },
              {
                path: 'report',
                element: <TransactionReportPage />,
              },
            ]
          },
          {
            path: 'product',
            children: [
              {
                index: true,
                element: <ListProductPage />,
              },
              {
                path: 'create',
                element: <CreatePage />,
              },
              {
                path: 'edit/:id',
                element: <EditPage />,
              },
            ]
          },
        ]
      }
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
