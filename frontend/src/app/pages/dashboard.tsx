// Dashboard Page - For authenticated users

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, Users, Plus, List, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import { Event, Club } from '../lib/types';
import { useAuth } from '../lib/auth-context';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [userClub, setUserClub] = useState<Club | null>(null);
  const [myClubs, setMyClubs] = useState<Club[]>([]);
  const [allClubsCount, setAllClubsCount] = useState<number>(0);

  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
      return;
    }

    api.getEvents().then(events => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const upcoming = events
        .filter(e => e.status === 'approved' && new Date(e.date) >= today)
        .slice(0, 5);
      setUpcomingEvents(upcoming);
    });

    api.getClubs().then(clubs => {
      setAllClubsCount(clubs.length);
    });

    if (user?.clubId) {
      api.getClubById(user.clubId).then(club => {
        if (club) setUserClub(club);
      });
    }
    
    if (user?.role === 'student') {
      api.getMyClubs().then(clubs => {
        setMyClubs(clubs);
      });
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your campus activities and upcoming events.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled on campus</p>
          </CardContent>
        </Card>

        {user?.role === 'student' ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Memberships</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myClubs.length}</div>
              <p className="text-xs text-muted-foreground">
                Active club memberships
              </p>
            </CardContent>
          </Card>
        ) : userClub ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Managed Club</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate">{userClub.name}</div>
              <p className="text-xs text-muted-foreground">
                {userClub.memberCount} active members
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Role</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{user?.role?.replace('_', ' ')}</div>
              <p className="text-xs text-muted-foreground">Platform access level</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campus Clubs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allClubsCount}</div>
            <p className="text-xs text-muted-foreground">Registered organizations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Events */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Events</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/events">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No upcoming events scheduled.
              </p>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
                  >
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary text-primary-foreground flex-shrink-0">
                      <span className="text-xs uppercase font-medium">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold">{event.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {event.clubName}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex gap-4 text-xs text-muted-foreground pt-1">
                        <span>🕐 {event.time}</span>
                        <span>📍 {event.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(user?.role === 'club_head' || user?.role === 'admin') && (
                <>
                  <Button asChild className="w-full justify-start">
                    <Link to="/create-event">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Event
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/my-events">
                      <List className="mr-2 h-4 w-4" />
                      My Club Events
                    </Link>
                  </Button>
                </>
              )}
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/clubs">
                  <Users className="mr-2 h-4 w-4" />
                  Explore Clubs
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/calendar">
                  <Calendar className="mr-2 h-4 w-4" />
                  Events Calendar
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
