import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  OnInit,
  signal,
} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from '../messages/messages.service';
import { catchError, from, throwError } from 'rxjs';
import {
  toObservable,
  toSignal,
  outputToObservable,
  outputFromObservable,
} from '@angular/core/rxjs-interop';
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'home',
  standalone: true,
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private dialog = inject(MatDialog);
  private messagesServide = inject(MessagesService);
  private coursesService = inject(CoursesService);

  private courses = signal<Course[]>([]);

  public begginerCourses = computed(() => {
    return this.courses().filter((course) => course.category === 'BEGINNER');
  });

  public advancedCourses = computed(() => {
    return this.courses().filter((course) => course.category === 'ADVANCED');
  });

  ngOnInit(): void {
    this.loadCourses();
  }

  private async loadCourses() {
    try {
      const courses = await this.coursesService.loadAllCourses();
      this.courses.set(
        courses.sort((courseA, courseB) => {
          return courseA.seqNo - courseB.seqNo;
        })
      );
    } catch (error) {
      this.messagesServide.showMessage('Error loading!', 'error');
      console.log(error);
    }
  }

  onCourseUpdated(updatedCourse: Course) {
    if (updatedCourse !== undefined) {
      const courses = this.courses();

      const updatedCoursesList = courses.map((course) => {
        if (course.id === updatedCourse.id) {
          return updatedCourse;
        }

        return course;
      });

      this.courses.set(updatedCoursesList);
    }
  }

  async onCourseDeleted(deletedCourseId: string) {
    try {
      await this.coursesService.deleteCourse(deletedCourseId);

      const courses = this.courses();
      const newCoursesList = courses.filter((course) => {
        return course.id !== deletedCourseId;
      });
      this.courses.set(newCoursesList);
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  async onAddCourse() {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'create',
      title: 'Create course',
    });

    if (newCourse !== undefined) {
      this.courses.update((coursesList) => [...coursesList, newCourse]);
    }
  }
}
