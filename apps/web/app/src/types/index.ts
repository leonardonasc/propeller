import type { Task } from '../schemas/tasks';

/** Summary of a user shown in the admin area. */
export type UserRecord = {
  id: string; name: string; email: string; role: 'user' | 'admin'; plan: 'free' | 'premium';
  isBanned: boolean; bannedUntil: string | null; deletedAt: string | null; createdAt: string;
};
/** Project summary shown in a user admin details view. */
export type ProjectRecord = { id: string; name: string; description: string | null; tasks: { id: string }[] };
/** User details with associated projects. */
export type UserDetails = UserRecord & { projects: ProjectRecord[] };
/** Paginated user results returned by the admin API. */
export type UserPage = { users: UserRecord[]; total: number; page: number; pageSize: number };
/** Roadmap item shown and edited in the admin area. */
export type RoadmapRecord = { id: string; title: string; description: string | null; status: 'planned' | 'in_progress' | 'completed'; category: 'feature' | 'improvement' | 'bug'; position: number };
/** Roadmap item before it receives an identifier. */
export type RoadmapDraft = Omit<RoadmapRecord, 'id'>;
/** Event shown in the calendar. */
export type EventItem = { id: string; title: string; description: string | null; startsAt: string; allDay: boolean };
/** Task with project details used by the dashboard. */
export type DashboardTask = Task & { projectId: string; projectName: string };
