import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Course } from '../models/course.model';

export type CreateCourse = Omit<Course, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class CoursesServiceWithFetch {
  env = environment;
  private url = `${this.env.apiRoot}/courses`;

  async loadAllCourses(): Promise<Course[]> {
    const response = await fetch(this.url);
    const payload = await response.json();

    return payload.courses;
  }

  async createCourse(course: CreateCourse): Promise<Course> {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(course),
    });

    return await response.json();
  }

  async saveCourse(courseId: string, data: Partial<Course>) {
    const response = await fetch(`${this.url}/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  async deleteCourse(courseId: string) {
    const response = await fetch(`${this.url}/${courseId}`, {
      method: 'DELETE',
    });

    return await response.json();
  }
}
