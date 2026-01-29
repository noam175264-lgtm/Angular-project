import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Task } from '../../../../core/models/task.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-task-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './edit-task-dialog.html',
  styleUrl: './edit-task-dialog.css',
})
export class EditTaskDialog {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public task: Task,
    private dialogRef: MatDialogRef<EditTaskDialog>,
  ) {
    this.form = this.fb.group({
      title: [''],
      description: [''],
      status: ['todo'],
      priority: ['normal'],
    });
    if (this.task) {
      this.form.patchValue(this.task);
    }
  }

  save(): void {
    if (this.form.valid) {
      const updatedTask = this.form.value;
      this.dialogRef.close(updatedTask);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}