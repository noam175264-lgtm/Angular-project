import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../core/environments/environments';
import { Observable } from 'rxjs';
import { Project } from '../../../core/models/project.model';

@Injectable({
  providedIn: 'root',
})
export class Projects {
  
  constructor(private http: HttpClient) { }

  getProjects(teamId: number) {
    return this.http.get(`${environment.apiUrl}/api/projects`);
  }

  createProject(data: {teamId: number; name: string; description: string }):Observable<Project> {
    return this.http.post<Project>(`${environment.apiUrl}/api/projects`, data);
  }

}
