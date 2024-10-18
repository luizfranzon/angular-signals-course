import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSignal = signal<boolean>(false);

  public loading = this.loadingSignal.asReadonly();

  loadingOn() {
    this.loadingSignal.set(true);
  }

  loadingOff() {
    this.loadingSignal.set(false);
  }
}
