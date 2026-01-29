import { Component, Inject, inject } from '@angular/core';
import { Tasks } from '../../services/tasks';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../../../../core/models/task.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { CreateTeamDialogComponent } from '../../../teams/dialogs/create-team-dialog/create-team-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Location } from '@angular/common';
import { EditTaskDialog } from '../edit-task-dialog/edit-task-dialog';
@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    DatePipe,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './tasks-list.html',
  styleUrl: './tasks-list.css',
})
export class TasksList {
  private tasksService = inject(Tasks);
  private tasksSubject$ = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject$.asObservable();
  private projectId: number = 0;
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private location = inject(Location);
  private router = inject(Router);
  constructor() {
    this.route.queryParams.subscribe(params => {
      this.projectId = Number(params['projectId']);
      if (this.projectId) {
        this.loadTasks(this.projectId);
      }
    });
  }

  loadTasks(projectId: number): void {
    this.tasksService.getTasks(projectId).subscribe((tasks) => {
      this.tasksSubject$.next(tasks as Task[]);
    });
  }

  createTask(): void {
    const dialogRef = this.dialog.open(CreateTeamDialogComponent, {
      width: '400px',
      disableClose: false,
      data: { dialogType: 'task' }
    });

    dialogRef.afterClosed().subscribe((result: Task) => {
      if (result) {
        this.tasksService.createTask({
          projectId: this.projectId,
          title: result.title,
          description: result.description
        }).subscribe({
          next: (task) => {
            console.log('Task created:', task);
            const currentTasks = this.tasksSubject$.value;
            this.tasksSubject$.next([...currentTasks, task]);
          },
          error: (error) => {
            console.error('Error creating task:', error);
          }
        });
      }
    });
  }

  getPriorityColor(priority: string): string {
    const priorityColors: { [key: string]: string } = {
      'low': '#4ade80',
      'normal': '#60a5fa',
      'high': '#fb923c',
      'urgent': '#ef4444'
    };
    return priorityColors[priority?.toLowerCase()] || '#60a5fa';
  }

  getPriorityIcon(priority: string): string {
    const priorityIcons: { [key: string]: string } = {
      'low': 'arrow_downward',
      'normal': 'remove',
      'high': 'arrow_upward',
      'urgent': 'priority_high'
    };
    return priorityIcons[priority?.toLowerCase()] || 'remove';
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'todo': '#94a3b8',
      'in-progress': '#60a5fa',
      'in_progress': '#60a5fa',
      'review': '#a78bfa',
      'done': '#4ade80',
      'blocked': '#ef4444'
    };
    return statusColors[status?.toLowerCase()] || '#94a3b8';
  }

  getStatusIcon(status: string): string {
    const statusIcons: { [key: string]: string } = {
      'todo': 'radio_button_unchecked',
      'in-progress': 'pending',
      'in_progress': 'pending',
      'review': 'rate_review',
      'done': 'check_circle',
      'blocked': 'block'
    };
    return statusIcons[status?.toLowerCase()] || 'radio_button_unchecked';
  }

  getTaskColor(index: number): string {
    const colors = [
      '#8b5cf6', '#ec4899', '#06b6d4', '#10b981',
      '#f59e0b', '#ef4444', '#6366f1', '#14b8a6',
      '#f97316', '#8b5cf6', '#22d3ee', '#a78bfa'
    ];
    return colors[index % colors.length];
  }


  editTask(task: Task, event: Event): void {
    event.stopPropagation();
    console.log('Edit task:', task.title);

    const dialogRef = this.dialog.open(EditTaskDialog, {
      width: '700px',
      data: task
    });

    dialogRef.afterClosed().subscribe((updatedTask: Task) => {
      if (updatedTask) {
        this.tasksService.updateTask(task.id, updatedTask
        ).subscribe({
          next: (updatedTask) => {
            console.log('Task updated:', updatedTask);
            const currentTasks = this.tasksSubject$.value;
            const index = currentTasks.findIndex(t => t.id === task.id);

            if (index !== -1) {
              currentTasks[index] = updatedTask;
              this.tasksSubject$.next([...currentTasks]);
            }
          },
          error: (error) => {
            console.error('Error updating task:', error);
          }
        });
      }
    });
  }

  deleteTask(task: Task, event: Event): void {
    event.stopPropagation();
    console.log('Delete task:', task.title);
    this.tasksService.deleteTask(task.id).subscribe({
      next: () => {
        console.log('Task deleted:', task.title);
        const currentTasks = this.tasksSubject$.value;
        this.tasksSubject$.next(currentTasks.filter(t => t.id !== task.id));
      },
      error: (error) => {
        console.error('Error deleting task:', error);
      }
    });
  }

  viewComments(task: Task, event: Event): void {
    event.stopPropagation();
    console.log('View comments for task:', task.title);
    this.router.navigate(['/comments'],
      { queryParams: { taskId: task.id } });
  }

  isOverdue(dueDate: string | null): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }

  getDaysUntilDue(dueDate: string | null): number {
    if (!dueDate) return 0;
    const diff = new Date(dueDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  back(): void {
    this.location.back();
  }
}