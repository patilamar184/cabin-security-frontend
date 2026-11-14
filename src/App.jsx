import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import OwnerLayout from './components/OwnerLayout';
import AdminLayout from './components/AdminLayout';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import RegisterVisitor from './pages/RegisterVisitor';
import VisitorList from './pages/VisitorList';
import EditVisitor from './pages/EditVisitor';
import Entries from './pages/Entries';
import Device from './pages/Device';
import Account from './pages/Account';
import AdminOverview from './pages/admin/AdminOverview';
import AdminOwners from './pages/admin/AdminOwners';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route element={<ProtectedRoute role="owner" />}>
        <Route element={<OwnerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/visitors" element={<VisitorList />} />
          <Route path="/visitors/new" element={<RegisterVisitor />} />
          <Route path="/visitors/:id/edit" element={<EditVisitor />} />
          <Route path="/entries" element={<Entries />} />
          <Route path="/device" element={<Device />} />
          <Route path="/account" element={<Account />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/owners" element={<AdminOwners />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
