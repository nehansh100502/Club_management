// Admin Dashboard

import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Users, Calendar, AlertCircle, Building2 } from 'lucide-react';
import { api } from '../../lib/api';
import { Event, Club } from '../../lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AdminDashboardPage() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalClubs, setTotalClubs] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [clubEventsData, setClubEventsData] = useState<{ name: string; events: number; members: number }[]>([]);

  useEffect(() => {
    Promise.all([
      api.getUsers(),
      api.getClubs(),
      api.getEvents(),
    ]).then(([users, clubs, events]: [any[], Club[], Event[]]) => {
      setTotalUsers(users.length);
      setTotalClubs(clubs.length);
      setTotalEvents(events.length);
      setPendingApprovals(events.filter(e => e.status === 'pending').length);

      // Build club activity data
      const data = clubs.map(club => ({
        name: club.name.length > 15 ? club.name.slice(0, 15) + '...' : club.name,
        events: events.filter(e => e.clubId === club.id).length,
        members: club.memberCount || 0,
      }));
      setClubEventsData(data);
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Platform overview, event approvals, and club administration.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered campus users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClubs}</div>
            <p className="text-xs text-muted-foreground">Active student clubs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">Organized events</p>
          </CardContent>
        </Card>

        <Card className={pendingApprovals > 0 ? "border-amber-500 bg-amber-50/50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className={`h-4 w-4 ${pendingApprovals > 0 ? 'text-amber-600' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${pendingApprovals > 0 ? 'text-amber-600' : ''}`}>{pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">{pendingApprovals > 0 ? 'Requires Dean/Admin review' : 'All events reviewed'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Button asChild variant="outline" className="h-auto flex-col items-start p-6 hover:border-primary">
          <Link to="/admin/event-approval">
            <AlertCircle className="mb-2 h-8 w-8 text-amber-600" />
            <span className="font-semibold text-base">Event Approval</span>
            <span className="text-xs text-muted-foreground">Review and approve submitted club events</span>
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-auto flex-col items-start p-6 hover:border-primary">
          <Link to="/admin/manage-clubs">
            <Building2 className="mb-2 h-8 w-8 text-primary" />
            <span className="font-semibold text-base">Manage Clubs</span>
            <span className="text-xs text-muted-foreground">Create, edit, or assign club leadership</span>
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-auto flex-col items-start p-6 hover:border-primary">
          <Link to="/admin/manage-users">
            <Users className="mb-2 h-8 w-8 text-primary" />
            <span className="font-semibold text-base">Manage Users</span>
            <span className="text-xs text-muted-foreground">Assign roles (Admin, Club Head, Student)</span>
          </Link>
        </Button>
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Events by Club</CardTitle>
            <CardDescription>Number of events organized across campus clubs</CardDescription>
          </CardHeader>
          <CardContent>
            {clubEventsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={clubEventsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="events" name="Total Events" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No data available.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Club Membership Distribution</CardTitle>
            <CardDescription>Enrolled student members per organization</CardDescription>
          </CardHeader>
          <CardContent>
            {clubEventsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={clubEventsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="members" name="Members" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
