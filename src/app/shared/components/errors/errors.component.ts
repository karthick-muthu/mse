import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../shared.service';
import { HomeService } from '../../../modules/home/home.service';
import * as _ from 'lodash';
import { AppComponent } from '../../../app.component';
import { ContentService } from '../../services/content/content.service';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'ms-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss']
})
export class ErrorsComponent implements OnInit {
  // appData:   AppComponent
  error: string;
  browser: any;
  routerDetails: any;
  details: any;
  osDetails: any;
  prerequisiteDetails: any;
  browserData: any;



  constructor(private route: ActivatedRoute, private sharedService: SharedService, private contentService: ContentService,
    private homeService: HomeService, private appData: AppComponent, private router: Router, private cookieService: CookieService) {
    this.sharedService.setBodyClass('clear');
    this.cookieService.remove('errorType');
    this.contentService.getRouterDetails().subscribe(
      result => this.browserData = result
    );
    if (!environment.production) { console.log('browserData', this.browserData); }
  }

  ngOnInit() {
    let title = '';
    this.sharedService.dismissOpenModal();
    this.error = _.get(this.route, 'params.value.type', '').toLowerCase();
    switch (this.error) {
      case 'unauthorized':
      case 'pagerefresh':
      case 'pageback':
        title = 'Unauthorized Access';
        break;
      case 'inactivity':
        title = 'Session Timed Out';
        break;
      case 'incompatiblebrowser':
        title = 'Incompatible Browser Detected';
        break;
      case 'firewall':
        title = 'Firewall Block';
        break;
      default:
        this.error = '404';
        title = '404 Page Not Found';
    }
    this.sharedService.setSiteTitle(title);
    /* this.osDetails = this.appData.deviceInfo.os_version.charAt(0).toUpperCase() + this.appData.deviceInfo.os_version.slice(1);
    if (this.osDetails === 'Unknown') {
      this.osDetails = 'OS / Device ';
    }
     this.browser = this.appData.deviceInfo.browser.charAt(0).toUpperCase() + this.appData.deviceInfo.browser.slice(1);
     */
  }

  continuePage() {
    this.router.navigate(['/home']);
  }
  logoutPage() {
    this.sharedService.setReloadRestrict('blockReload');
    this.homeService.logout();
  }
}
