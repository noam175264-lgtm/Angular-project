import { Component, inject } from '@angular/core';
import { Comments } from '../../services/comments';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, JsonPipe, CommonModule, DatePipe } from '@angular/common';
import { Comment } from '../../../../core/models/comment.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateTeamDialogComponent } from '../../../teams/dialogs/create-team-dialog/create-team-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { Location } from '@angular/common';

@Component({
  selector: 'app-comments-list',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    CommonModule,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MatDialogModule
  ],
  templateUrl: './comments-list.html',
  styleUrl: './comments-list.css',
})
export class CommentsList {
  private commentsService = inject(Comments);
  private commentsSubject$ = new BehaviorSubject<Comment[]>([]);
  comments$ = this.commentsSubject$.asObservable();
  private taskId: number = 0;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private dialog = inject(MatDialog);

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.taskId = Number(params['taskId']);
      if (this.taskId) {
        this.loadComments(this.taskId);
      }
    });
  }

  back(): void {
    this.location.back();
  }

  loadComments(taskId: number): void {
    this.commentsService.getComments(taskId).subscribe((comments) => {
      this.commentsSubject$.next(comments as Comment[]);
    });
  }

  createComment(): void {
    const dialogRef = this.dialog.open(CreateTeamDialogComponent, {
      width: '400px',
      disableClose: false,
      data: { dialogType: 'comment' }
    });
    
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        this.commentsService.createComment(
          { taskId: this.taskId, body: result }
        ).subscribe({
          next: (comment) => {
            console.log('Comment created:', comment);
            const currentComments = this.commentsSubject$.value;
            this.commentsSubject$.next([...currentComments, comment]);
          },
          error: (error) => {
            console.error('Error creating comment:', error);  
          }
        });
      }
    });
  }

  getCommentColor(index: number): string {
    const colors = [
      '#06b6d4', '#8b5cf6', '#ec4899', '#10b981',
      '#f59e0b', '#6366f1', '#14b8a6', '#f97316',
      '#ef4444', '#a78bfa', '#22d3ee', '#84cc16'
    ];
    return colors[index % colors.length];
  }

  getInitials(name: string | undefined): string {
    if (!name) return '??';
    
    const parts = name.trim().split(/\s+/);
    
    if (parts.length === 1) {
      return name.substring(0, 2).toUpperCase();
    }
    
    return parts
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  getUserName(): string | undefined {
    return localStorage.getItem('name') ?? undefined;
  }
}