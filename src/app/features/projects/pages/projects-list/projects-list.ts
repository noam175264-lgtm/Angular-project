import { Component, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Projects } from '../../services/projects';
import { AsyncPipe, CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CreateTeamDialogComponent } from '../../../teams/dialogs/create-team-dialog/create-team-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Project } from '../../../../core/models/project.model';

@Component({
  selector: 'app-projects-list',
  imports: [
    AsyncPipe,
    JsonPipe,
    CommonModule,
    DatePipe,
    MatIcon,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatRippleModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.css',
})
export class ProjectsList {
  private projectsService = inject(Projects);
  private projectsSubject$ = new BehaviorSubject<Project[]>([]);
  projects$ = this.projectsSubject$.asObservable();
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private teamId: number = 0;
  private router = inject(Router);

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.teamId = Number(params['teamId']);
      if (this.teamId) {
        this.loadProjects(this.teamId);
      }
    });

  }
  loadProjects(teamId: number): void {
    this.projectsService.getProjects(teamId).subscribe((projects) => {
      const filteredProjects = (projects as Project[]).filter(project => project.team_id === teamId);
      this.projectsSubject$.next(filteredProjects);
    });
  }

  createProject(): void {
    const dialogRef = this.dialog.open(CreateTeamDialogComponent, {
      width: '400px',
      disableClose: false,
      data: { dialogType: 'project' }
    });

    dialogRef.afterClosed().subscribe((result:Project) => {
      if (result) {
        this.projectsService.createProject({
          teamId: this.teamId,
          name: result.name,
          description: result.description
        }).subscribe({
          next: (project) => {
            console.log('Project created:', project);
            const currentProjects = this.projectsSubject$.value;
            this.projectsSubject$.next([...currentProjects, project]);
          },
          error: (err) => {
            console.error('Project creation failed', err);
          }
        });
      }
    });
  }
  viewTasks(projectId: number): void {
    console.log('View tasks for project ID:', projectId);
    this.router.navigate(['/tasks'],
       { queryParams: { projectId } });
  }
  getProjectColor(index: number): string {
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#4facfe',
      '#43e97b', '#fa709a', '#fee140', '#30cfd0',
      '#a8edea', '#fed6e3', '#c471f5', '#17ead9'
    ];
    return colors[index % colors.length];
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'active': '#43e97b',
      'completed': '#667eea',
      'pending': '#f093fb',
      'archived': '#64748b'
    };
    return statusColors[status.toLowerCase()] || '#64748b';
  }

  getStatusIcon(status: string): string {
    const statusIcons: { [key: string]: string } = {
      'active': 'play_circle',
      'completed': 'check_circle',
      'pending': 'pending',
      'archived': 'archive'
    };
    return statusIcons[status.toLowerCase()] || 'info';
  }

  

}


