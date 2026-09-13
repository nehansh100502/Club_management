// Types for Student Club Management System

export type UserRole = 'admin' | 'club_head' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clubId?: string;
  joinedClubIds?: string[];
}

export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  logo?: string;
  headId: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  clubId: string;
  clubName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdBy: string;
  attendanceCount?: number;
}
