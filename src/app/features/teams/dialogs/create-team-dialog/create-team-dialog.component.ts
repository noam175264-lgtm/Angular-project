import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

type DialogType = 'team' | 'project' | 'task' | 'comment';

@Component({
  selector: 'app-create-team-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ getTitle() }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <!-- Team form -->
        @if(dialogType === 'team'){
          <ng-container >
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Team Name</mat-label>
              <input matInput formControlName="teamName" required />
            </mat-form-field>
          </ng-container>
        }

        <!-- Project form -->
        @if(dialogType === 'project'){
          <ng-container >
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Project Name</mat-label>
              <input matInput formControlName="projectName" required />
            </mat-form-field>
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="projectDescription" rows="3"></textarea>
            </mat-form-field>
          </ng-container>
        }

        <!-- Task form -->
        @if(dialogType === 'task'){
          <ng-container >
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Task Title</mat-label>
              <input matInput formControlName="taskTitle" required />
            </mat-form-field>
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="taskDescription" rows="3"></textarea>
            </mat-form-field>
          </ng-container>
        }

        <!-- Comment form -->
        @if(dialogType === 'comment'){
          <ng-container > 
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Comment</mat-label>
              <textarea matInput formControlName="commentBody" rows="4" required></textarea>
            </mat-form-field>
          </ng-container>
        }
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="!form.valid"
      >
        {{ getSubmitButtonText() }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 16px; }`],
})
export class CreateTeamDialogComponent {
  dialogType: DialogType;

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreateTeamDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { dialogType: DialogType }) {
    this.dialogType = data?.dialogType || 'team';
  }

  form = this.fb.group({
    teamName: [''],
    userId: [null],
    role: ['member'],
    projectName: [''],
    projectDescription: [''],
    taskTitle: [''],
    taskDescription: [''],
    commentBody: [''],
  });

  ngOnInit(): void {
    this.updateFormValidators();
  }

  private updateFormValidators(): void {
    const teamNameControl = this.form.get('teamName');
    const userIdControl = this.form.get('userId');
    const roleControl = this.form.get('role');
    const projectNameControl = this.form.get('projectName');
    const projectDescriptionControl = this.form.get('projectDescription');
    const taskTitleControl = this.form.get('taskTitle');
    const taskDescriptionControl = this.form.get('taskDescription');
    const commentBodyControl = this.form.get('commentBody');

    if (this.dialogType === 'team') {
      teamNameControl?.setValidators([Validators.required, Validators.minLength(1)]);
      userIdControl?.clearValidators();
      roleControl?.clearValidators();
      projectNameControl?.clearValidators();
      projectDescriptionControl?.clearValidators();
      taskTitleControl?.clearValidators();
      taskDescriptionControl?.clearValidators();
      commentBodyControl?.clearValidators();
    } else if (this.dialogType === 'project') {
      teamNameControl?.clearValidators();
      userIdControl?.clearValidators();
      roleControl?.clearValidators();
      projectNameControl?.setValidators([Validators.required, Validators.minLength(1)]);
      projectDescriptionControl?.clearValidators();
      taskTitleControl?.clearValidators();
      taskDescriptionControl?.clearValidators();
      commentBodyControl?.clearValidators();
    } else if (this.dialogType === 'task') {
      teamNameControl?.clearValidators();
      userIdControl?.clearValidators();
      roleControl?.clearValidators();
      projectNameControl?.clearValidators();
      projectDescriptionControl?.clearValidators();
      taskTitleControl?.setValidators([Validators.required, Validators.minLength(1)]);
      taskDescriptionControl?.clearValidators();
      commentBodyControl?.clearValidators();
    } else if (this.dialogType === 'comment') {
      teamNameControl?.clearValidators();
      userIdControl?.clearValidators();
      roleControl?.clearValidators();
      projectNameControl?.clearValidators();
      projectDescriptionControl?.clearValidators();
      taskTitleControl?.clearValidators();
      taskDescriptionControl?.clearValidators();
      commentBodyControl?.setValidators([Validators.required, Validators.minLength(1)]);
    }

    teamNameControl?.updateValueAndValidity();
    userIdControl?.updateValueAndValidity();
    roleControl?.updateValueAndValidity();
    projectNameControl?.updateValueAndValidity();
    projectDescriptionControl?.updateValueAndValidity();
    taskTitleControl?.updateValueAndValidity();
    taskDescriptionControl?.updateValueAndValidity();
    commentBodyControl?.updateValueAndValidity();
  }

  getTitle(): string {
    if (this.dialogType === 'team') return 'Create New Team';
    if (this.dialogType === 'project') return 'Create New Project';
    if (this.dialogType === 'task') return 'Create New Task';
    return 'Add Comment';
  }

  getSubmitButtonText(): string {
    if (this.dialogType === 'team') return 'Create Team';
    if (this.dialogType === 'project') return 'Create Project';
    if (this.dialogType === 'task') return 'Create Task';
    return 'Add Comment';
  }

  onSubmit(): void {
    if (this.form.valid) {
      let result;
      if (this.dialogType === 'team') {
        result = this.form.value.teamName;
      } else if (this.dialogType === 'project') {
        result = {
          name: this.form.value.projectName,
          description: this.form.value.projectDescription || null
        };
      } else if (this.dialogType === 'task') {
        result = {
          title: this.form.value.taskTitle,
          description: this.form.value.taskDescription
        };
      } else if (this.dialogType === 'comment') {
        result = this.form.value.commentBody;
      }
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}