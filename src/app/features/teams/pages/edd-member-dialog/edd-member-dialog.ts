import { Component, inject, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TeamMember } from '../../../../core/models/team.model';
import { Teams } from '../../services/teams';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-edd-member-dialog',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './edd-member-dialog.html',
  styleUrl: './edd-member-dialog.css',
})
export class EddMemberDialog {
  private userService = inject(Teams);
  users$: Observable<TeamMember[]>;
  selectedUser: TeamMember | null = null;
  selectedRole: string = 'member';

  ngOnInit() {
    this.users$ = this.userService.getUsers() as Observable<TeamMember[]>;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public member: TeamMember,
    private dialogRef: MatDialogRef<EddMemberDialog>,
  ) { }

  addSelectedUsers() {
    if (this.selectedUser) {
      this.dialogRef.close({
        user: this.selectedUser,
        role: this.selectedRole
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}