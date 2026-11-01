import { ThemeProvider } from './context/ThemeContext';

import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from './config/constants';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/Login/LoginPage';
import HomePage from './pages/Home/HomePage';
import RegistrationPage from './pages/Registration/RegistrationPage';
import VisitorsPage from './pages/Visitors/VisitorsPage';
import PreviousEntriesPage from './pages/PreviousEntries/PreviousEntriesPage';
import EditRegistrationPage from './pages/EditRegistration/EditRegistrationPage';
import DeleteRegistrationPage from './pages/DeleteRegistration/DeleteRegistrationPage';
import AccountPage from './pages/Account/AccountPage';

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.REGISTRATION} element={<RegistrationPage />} />
            <Route path={ROUTES.VISITORS} element={<VisitorsPage />} />
            <Route path={ROUTES.PREVIOUS_ENTRIES} element={<PreviousEntriesPage />} />
            <Route
              path={`${ROUTES.EDIT_REGISTRATION}/:id?`}
              element={<EditRegistrationPage />}
            />
            <Route
              path={`${ROUTES.DELETE_REGISTRATION}/:id?`}
              element={<DeleteRegistrationPage />}
            />
            <Route path={ROUTES.ACCOUNT} element={<AccountPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </ThemeProvider>
  );
}