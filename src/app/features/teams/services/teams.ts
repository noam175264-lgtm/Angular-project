import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../core/environments/environments';
import { Observable } from 'rxjs';
import { Team, TeamMember } from '../../../core/models/team.model';

@Injectable({
  providedIn: 'root',
})
export class Teams {
  constructor(private http: HttpClient) { }

  getTeams():Observable<Team> {
    return this.http.get<Team>(`${environment.apiUrl}/api/teams`);
  }

  createTeam(data: { name: string; }):Observable<Team> {
    return this.http.post<Team>(`${environment.apiUrl}/api/teams`, data);
  }

  addMember(teamId: number, userId: string, role: any): Observable<TeamMember> {
    return this.http.post<TeamMember>(`${environment.apiUrl}/api/teams/${teamId}/members`, { userId, role});
  }

  deleteTeam(teamId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/teams/${teamId}`);
  }

  getUsers() {
    return this.http.get(`${environment.apiUrl}/api/users`);
  }

  getTeamMembers(teamId: number): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${environment.apiUrl}/api/teams/${teamId}/members`);
  }

}
