import { Routes } from '@angular/router';
import { Login } from './auth/pages/login/login';
import { Register } from './auth/pages/register/register';
import { TeamsList } from './features/teams/pages/teams-list/teams-list';
import { ProjectsList } from './features/projects/pages/projects-list/projects-list';
import { TasksList } from './features/tasks/pages/tasks-list/tasks-list';
import { CommentsList } from './features/comments/pages/comments-list/comments-list';
import { guardAuthGuard } from './auth/guards/guard.auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: Login },
    {path: 'register', component:Register},
    {path: 'teams', component: TeamsList,canActivate: [guardAuthGuard]}, 
    {path:'projects', component:ProjectsList, canActivate: [guardAuthGuard]},
    {path:'tasks', component:TasksList, canActivate: [guardAuthGuard]},
    {path:'comments', component:CommentsList, canActivate: [guardAuthGuard]},

];