import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'ms-content-preview-iframe',
  templateUrl: './content-preview-iframe.component.html',
  styleUrls: ['./content-preview-iframe.component.scss']
})
export class ContentPreviewIframeComponent implements OnInit {
  screenHeight: number;
  url: any;
  contentPreviewWidth = 360;
  contentPreviewHeight = 640;
  deviceList = [{
    name: 'Nexus 5',
    width: 360,
    height: 640
  }, {
    name: 'Kindle Fire HDX',
    width: 800,
    height: 1200
  }, {
    name: 'Nexus 7',
    width: 600,
    height: 960
  }, {
    name: 'iPhone 5/SE',
    width: 320,
    height: 568
  }, {
    name: 'iPhone 6/7/8',
    width: 375,
    height: 667
  }, {
    name: 'iPhone 6/7/8 Plus',
    width: 414,
    height: 736
  }, {
    name: 'iPhone X',
    width: 375,
    height: 812
  }, {
    name: 'iPad',
    width: 768,
    height: 1024
  }, {
    name: 'iPad Plus',
    width: 1024,
    height: 1366
  }, {
    name: 'Pixel 2',
    width: 411,
    height: 731
  }, {
    name: 'Pixel 2 XL',
    width: 411,
    height: 823
  }];
  selectedDevice: any;
  selectedTheme = 'lower';
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
  }
  constructor(private router: Router) {
    this.getScreenSize();
    this.url = this.router.url.substring(this.router.url.indexOf('?') + 1);
  }

  ngOnInit() {
    this.selectedDevice = this.deviceList[0];
    document.getElementById('preview').setAttribute('src', '../Student/contentPreviewIframe?' + this.url + '&level=' + this.selectedTheme);
  }

  changePreviewWidth() {
    document.getElementById('preview').setAttribute('width', this.contentPreviewWidth.toString());
  }

  changePreviewHeight() {
    document.getElementById('preview').setAttribute('height', this.contentPreviewHeight.toString());
  }

  switchPortraitMode() {
    if (this.contentPreviewWidth > this.contentPreviewHeight) {
      let temp = this.contentPreviewWidth;
      this.contentPreviewWidth = this.contentPreviewHeight;
      this.contentPreviewHeight = temp;
      this.changePreviewWidth();
      this.changePreviewHeight();
    } else return;
  }

  switchLandscapeMode() {
    if (this.contentPreviewWidth < this.contentPreviewHeight) {
      let temp = this.contentPreviewWidth;
      this.contentPreviewWidth = this.contentPreviewHeight;
      this.contentPreviewHeight = temp;
      this.changePreviewWidth();
      this.changePreviewHeight();
    } else return;
  }

  updateDeviceView() {
    this.contentPreviewWidth = Number(this.selectedDevice.substring(0, this.selectedDevice.indexOf(' ')));
    this.contentPreviewHeight = Number(this.selectedDevice.substring(this.selectedDevice.indexOf(' ') + 1));
    this.changePreviewWidth();
    this.changePreviewHeight();
  }

  updateTheme() {
    document.getElementById('preview').setAttribute('src', '../Student/contentPreviewIframe?' + this.url + '&level=' + this.selectedTheme);
  }

}
