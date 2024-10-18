import { Component, effect, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { Course } from '../models/course.model';
import { EditCourseDialogData } from './edit-course-dialog.data.model';
import { CoursesService } from '../services/courses.service';
import { LoadingIndicatorComponent } from '../loading/loading.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CourseCategoryComboboxComponent } from '../course-category-combobox/course-category-combobox.component';
import { CourseCategory } from '../models/course-category.model';
import { firstValueFrom } from 'rxjs';
import { CreateCourse } from '../services/courses-fetch.service';

@Component({
  selector: 'edit-course-dialog',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    CourseCategoryComboboxComponent,
  ],
  templateUrl: './edit-course-dialog.component.html',
  styleUrl: './edit-course-dialog.component.scss',
})
export class EditCourseDialogComponent {
  private dialogRef = inject(MatDialogRef);
  private formBuilder = inject(FormBuilder);
  private coursesService = inject(CoursesService);
  public data: EditCourseDialogData = inject(MAT_DIALOG_DATA);

  category = signal<CourseCategory>('BEGINNER');

  form = this.formBuilder.group({
    title: [''],
    longDescription: [''],
    iconUrl: [''],
  });

  ngOnInit(): void {
    const dialogData = this.data.course;
    this.form.patchValue({
      title: dialogData?.title,
      longDescription: dialogData?.longDescription,
      iconUrl: dialogData?.iconUrl,
    });
    this.category.set(this.data.course?.category! ?? 'BEGINNER');
  }

  public onSave() {
    const courseProps = this.form.value as Partial<Course>;
    courseProps.category = this.category();

    if (this.data.mode === 'update') {
      this.saveCourse(this.data!.course!.id, courseProps);
    } else if (this.data.mode === 'create') {
      this.createCourse(courseProps as CreateCourse);
    }
  }

  async saveCourse(courseId: string, changes: Partial<Course>) {
    try {
      const updatedCourse = await this.coursesService.saveCourse(
        courseId,
        changes
      );
      this.dialogRef.close(updatedCourse);
    } catch (error) {
      console.error(error);
    }
  }

  async createCourse(course: CreateCourse) {
    try {
      const newCourse = await this.coursesService.createCourse(course);
      this.dialogRef.close(newCourse);
    } catch (error) {
      console.error(error);
    }
  }

  public onClose() {
    this.dialogRef.close();
  }
}

export async function openEditCourseDialog(
  dialog: MatDialog,
  data: EditCourseDialogData
) {
  const config = new MatDialogConfig();
  config.disableClose = true;
  config.autoFocus = true;
  config.width = '400px';
  config.data = data;

  const close$ = dialog.open(EditCourseDialogComponent, config).afterClosed();

  return firstValueFrom(close$);
}
