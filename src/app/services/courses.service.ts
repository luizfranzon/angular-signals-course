import { firstValueFrom } from 'rxjs';
import { Course } from '../models/course.model';
import { inject, Injectable } from '@angular/core';
import { CreateCourse } from './courses-fetch.service';
import { environment } from '../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { GetCoursesResponse } from '../models/get-courses.response';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  httpClient = inject(HttpClient);

  env = environment;
  private url = `${this.env.apiRoot}/courses`;

  async loadAllCourses(): Promise<Course[]> {
    const courses$ = this.httpClient.get<GetCoursesResponse>(this.url);

    const response = await firstValueFrom(courses$);
    return response.courses;
  }

  async getCourseById(id: string): Promise<Course> {
    const course$ = this.httpClient.get<Course>(`${this.url}/${id}`);

    const course = await firstValueFrom(course$);
    return course;
  }

  async createCourse(courseId: CreateCourse): Promise<Course> {
    const course$ = this.httpClient.get<Course>(`${this.url}/${courseId}`);
    return firstValueFrom(course$);
  }

  async saveCourse(courseId: string, data: Partial<Course>): Promise<Course> {
    const course$ = this.httpClient.put<Course>(
      `${this.url}/${courseId}`,
      data
    );
    return firstValueFrom(course$);
  }

  async deleteCourse(courseId: string) {
    const delete$ = this.httpClient.delete(`${this.url}/${courseId}`);
    return firstValueFrom(delete$);
  }
}
