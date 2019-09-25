import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../modules/auth/services/auth/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'ms-account-locked',
  templateUrl: './account-locked.component.html',
  styleUrls: ['./account-locked.component.scss']
})
export class AccountLockedComponent implements OnInit, OnDestroy {
  userDetailsSubscription: Subscription;
  userCategory: any;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.setSiteTitle('Account Locked');
    this.userDetailsSubscription = this.authService.getUsername().subscribe(result => {
      this.userCategory = result.category;
    });
  }

  ngOnInit() {
  }
  goToLogin() {
    this.router.navigate(['/']);
  }
  ngOnDestroy(): void {
    this.userDetailsSubscription.unsubscribe();
  }
}
