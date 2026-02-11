import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  // A BehaviorSubject acts as a "stream" of true/false values
  public isLoading = new BehaviorSubject<boolean>(false);

  show() {
    this.isLoading.next(true);
  }

  hide() {
    this.isLoading.next(false);
  }
}