// Routes configuration

import { createBrowserRouter } from 'react-router';
import { MainLayout } from './components/layout/main-layout';
import { ProtectedRoute } from './components/auth/protected-route';

// Public pages
import Home from './pages/home';
import ClubsPage from './pages/clubs';
import ClubDetailsPage from './pages/club-details';
import EventsPage from './pages/events';
import CalendarPage from './pages/calendar';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';

// Authenticated user pages
import DashboardPage from './pages/dashboard';
import CreateEventPage from './pages/create-event';
import MyEventsPage from './pages/my-events';
import MyClubsPage from './pages/memberships';
import EditEventPage from './pages/edit-event';

// Admin & Management pages
import AdminDashboardPage from './pages/admin/admin-dashboard';
import EventApprovalPage from './pages/admin/event-approval';
import ManageClubsPage from './pages/admin/manage-clubs';
import ManageUsersPage from './pages/admin/manage-users';

// 404 Page
function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="mb-4">404 - Page Not Found</h1>
      <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      // Public routes
      { index: true, Component: Home },
      { path: 'clubs', Component: ClubsPage },
      { path: 'clubs/:id', Component: ClubDetailsPage },
      { path: 'events', Component: EventsPage },
      { path: 'calendar', Component: CalendarPage },
      { path: 'login', Component: LoginPage },
      { path: 'signup', Component: SignupPage },

      // Authenticated user routes
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'memberships',
        element: (
          <ProtectedRoute>
            <MyClubsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-clubs',
        element: (
          <ProtectedRoute>
            <MyClubsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'create-event',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'club_head']}>
            <CreateEventPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-events',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'club_head']}>
            <MyEventsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'edit-event/:id',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'club_head']}>
            <EditEventPage />
          </ProtectedRoute>
        ),
      },

      // Admin & Management routes
      {
        path: 'admin/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/event-approval',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <EventApprovalPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/manage-clubs',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'club_head']}>
            <ManageClubsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/manage-users',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageUsersPage />
          </ProtectedRoute>
        ),
      },

      // 404
      { path: '*', Component: NotFound },
    ],
  },
]);
