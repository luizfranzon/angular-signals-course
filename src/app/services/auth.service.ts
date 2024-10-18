import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { computed, effect, inject, Injectable, signal } from '@angular/core';

const USER_STORAGE_KEY = 'user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = `${environment.apiRoot}/login`;

  private router = inject(Router);
  private httpClient = inject(HttpClient);

  private userSignal = signal<User | null>(null);
  public user = this.userSignal.asReadonly();
  isLoggedIn = computed(() => !!this.user());

  constructor() {
    this.loadUserFromStorage();
    effect(() => {
      const user = this.user();

      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }
    });
  }

  loadUserFromStorage() {
    const storageData = localStorage.getItem(USER_STORAGE_KEY);

    if (storageData) {
      const user = JSON.parse(storageData);
      this.userSignal.set(user);
    }
  }

  async login(email: string, password: string): Promise<User> {
    const login$ = this.httpClient.post<User>(this.url, {
      email,
      password,
    });

    const user = await firstValueFrom(login$);
    this.userSignal.set(user);

    return user;
  }

  async logout() {
    localStorage.removeItem(USER_STORAGE_KEY);
    this.userSignal.set(null);
    await this.router.navigateByUrl('/login');
  }
}
