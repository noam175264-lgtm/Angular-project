import { Component, Inject, inject } from '@angular/core';
import { Teams } from '../../services/teams';
import { Observable } from 'rxjs';
import { TeamMember } from '../../../../core/models/team.model';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AsyncPipe, JsonPipe, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-view-members',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './view-members.html',
  styleUrl: './view-members.css',
})
export class ViewMembers {
  private teamsService = inject(Teams);
  members$: Observable<TeamMember[]>;
  teamId: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {
    this.teamId = data;
    this.members$ = this.teamsService.getTeamMembers(this.teamId);
  }
}