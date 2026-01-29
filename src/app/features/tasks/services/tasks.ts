import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../core/environments/environments';
import { Observable } from 'rxjs';
import { Task } from '../../../core/models/task.model';
@Injectable({
  providedIn: 'root',
})
export class Tasks {
  constructor(private http: HttpClient) { }

  getTasks(projectId: number) {
    return this.http.get(`${environment.apiUrl}/api/tasks?projectId=${projectId}`);
  }

  createTask(data: {projectId: number; title: string; description: string }):Observable<Task> {
    return this.http.post<Task>(`${environment.apiUrl}/api/tasks`, data);
  }
  
  updateTask(taskId: number, task:Task): Observable<Task> { 
    return this.http.patch<Task>(`${environment.apiUrl}/api/tasks/${taskId}`, task);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/tasks/${taskId}`);
  }

  
}
