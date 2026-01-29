import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from '../../../core/models/comment.model';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../core/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class Comments {
  constructor(private http: HttpClient) { }

  getComments(taskId: number) {
    return this.http.get(`${environment.apiUrl}/api/comments?taskId=${taskId}`);
  }

  createComment(data:{taskId: number, body: string }):Observable<Comment> {
    return this.http.post<Comment>(`${environment.apiUrl}/api/comments`, {body: data.body, taskId: data.taskId});
  }
}
