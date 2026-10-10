import React from 'react';
import { Link } from 'react-router-dom';

const ACTIONS = [
  { to: '/admin/products/new', label: 'Add Product',    },
  { to: '/admin/categories',   label: 'Add Category',   },
  { to: '/admin/orders',       label: 'Manage Orders',  },
  { to: '/admin/users',        label: 'View Users',     },
];

const QuickActions = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {ACTIONS.map(a => (
      <Link key={a.to} to={a.to}
        className={`flex items-center justify-center gap-2 p-4  bg-rose-300 rounded-xl font-medium text-sm hover:bg-rose-600`}>
        {a.label}
      </Link>
    ))}
  </div>
);

export default QuickActions;