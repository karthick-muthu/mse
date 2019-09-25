import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'ms-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  errorInfo: any;
  showLoader: any;
  constructor(private authService: AuthService) {
    this.authService.setBodyClass('clear');
  }

  ngOnInit() {
  }

}
