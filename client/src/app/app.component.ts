import {Component, HostListener} from '@angular/core';
import {AuthService} from "./services/auth.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';

  constructor(private authService: AuthService) {
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: Event): void {
    if (sessionStorage.getItem('refresh') === null) {
      this.authService.clearToken();
    } else {
      sessionStorage.removeItem('refresh');
    }
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event: Event): void {
    sessionStorage.setItem('refresh', 'true');
  }
}
