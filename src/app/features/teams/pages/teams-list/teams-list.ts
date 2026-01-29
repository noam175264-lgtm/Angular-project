import { Component, inject } from '@angular/core';
import { Teams } from '../../services/teams';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateTeamDialogComponent } from '../../dialogs/create-team-dialog/create-team-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { Router, RouterModule } from '@angular/router';
import { Team } from '../../../../core/models/team.model';
import { EddMemberDialog } from '../edd-member-dialog/edd-member-dialog';
import { select } from '@ngrx/store';
import { ViewMembers } from '../view-members/view-members';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatRippleModule,
    RouterModule
  ],
  templateUrl: './teams-list.html',
  styleUrl: './teams-list.css',
})
export class TeamsList {
  private router = inject(Router);
  private teamsService = inject(Teams);
  private dialog = inject(MatDialog);
  private teamsSubject$ = new BehaviorSubject<Team[]>([]);
  teams$ = this.teamsSubject$.asObservable();

  constructor() {
    this.teamsService.getTeams().subscribe((teams) => {
      this.teamsSubject$.next(teams as unknown as Team[]);
    });
  }

  createTeam(): void {
    const dialogRef = this.dialog.open(CreateTeamDialogComponent, {
      width: '400px',
      disableClose: false,
      data: { dialogType: 'team' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.teamsService.createTeam({ name: result }).subscribe({
          next: (team) => {
            console.log('Team created:', team);
            const currentTeams = this.teamsSubject$.value;
            this.teamsSubject$.next([...currentTeams, team]);
          },
          error: (err) => {
            console.error('Error creating team:', err);
          },
        });
      }
    });
  }

  getTeamColor(index: number): string {
    const colors = [
      '#FF6B9D', '#C44569', '#FFA07A', '#20B2AA',
      '#9B59B6', '#3498DB', '#E74C3C', '#F39C12',
      '#1ABC9C', '#34495E', '#16A085', '#27AE60'
    ];
    return colors[index % colors.length];
  }

  addMember(teamId: number, team: Team, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const dialogRef = this.dialog.open(EddMemberDialog, {
      width: '1000px',
      disableClose: false,
      data: { dialogType: 'member' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.user && result.role) {
        const currentTeams = this.teamsSubject$.value;
        const index = currentTeams.findIndex(t => t.id === team.id);

        if (index !== -1) {
          const teamMembers = currentTeams[index].members || [];
          const userExists = teamMembers.some((m: any) => m.userId === result.user.id);

          if (userExists) {
            alert('This user is already a member of this team');
            return;
          }

          this.teamsService.addMember(teamId, result.user.id, result.role).subscribe({
            next: () => {
              this.teamsService.getTeams().subscribe((teams) => {
                this.teamsSubject$.next(teams as unknown as Team[]);
              });
            },
            error: (err) => {
              console.error('Error adding member:', err);
            },
          });
        }
      }
    });
  }
  viewProjects(teamId: number): void {
    console.log('Navigating to projects page');
    this.router.navigate(['/projects'], {
      queryParams: { teamId }
    });
  }

  deleteTeam(team: Team, event: Event): void {
    event.stopPropagation();
    console.log('Delete team:', team.name);
    this.teamsService.deleteTeam(team.id).subscribe({
      next: () => {
        console.log('Team deleted:', team.name);
        const currentTeams = this.teamsSubject$.value;
        this.teamsSubject$.next(currentTeams.filter(t => t.id !== team.id));
      },
      error: (error) => {
        console.error('Error deleting team:', error);
      }
    });

  }
  viewMembers(teamId: number): void {
    const dialogRef = this.dialog.open(ViewMembers, {
      width: '700px',
      disableClose: false,
      data: teamId
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }
}