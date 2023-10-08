import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderUtilService {

  constructor(private authService: AuthService) {
  }

  getHeaders(): HttpHeaders {
    const jwtToken = this.authService.getToken();
    return jwtToken ? new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`) : new HttpHeaders();
  }
}

