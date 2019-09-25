import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/platform-browser';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { AppSettings } from '../../../../settings/app.settings';
import { CountryCode } from '../../../../settings/country-code';
import { ContentService } from '../../../../shared/services/content/content.service';
import { SharedService } from '../../../../shared/shared.service';
import { DOBValidator } from '../../../../shared/validators/dob/dob.validator';
import { MyDetailsService } from './my-details.service';
import { ApiSettings } from '../../../../settings/app.api-settings';

@Component({
  selector: 'ms-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.scss']
})
export class MyDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('avatarFile') avatarFile;
  @ViewChild('successDetails') successDetails;
  @ViewChild('countryDropdown') countryDropdown;
  @ViewChild('countryDropdownMenu') countryDropdownMenu;
  template: string;
  templateClass: string;
  myDetails: any;
  genderPics = _.get(AppSettings, 'ERROR_PROFILE_IMAGE', ['', '']);
  countries: any;
  securityQuestions: any;
  myDetail: FormGroup;
  profilePicError: string;
  profileImage: string;
  errorInfo: any;
  private items: any[] = [];
  private basicData: any;
  private getTemplateService: Subscription;
  private getBasicDataService: Subscription;

  constructor(private sharedService: SharedService, private contentService: ContentService, private myDetailsService: MyDetailsService,
    @Inject(DOCUMENT) private document: Document) {
    this.sharedService.setSiteTitle('My Details');
    this.myDetail = this.initializeMyDetailFormData();
    this.countries = CountryCode.allCountries;
    this.getTemplateService = this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.templateClass = this.sharedService.getClassName();
      },
      responseError => this.errorInfo = responseError
    );
    this.getBasicDataService = this.contentService.getBasicData().subscribe(
      result => this.basicData = result,
      responseError => this.errorInfo = responseError
    );
  }

  ngOnInit() {
    this.getMyDetailsData();
  }

  ngOnDestroy() {
    this.getTemplateService.unsubscribe();
    this.getBasicDataService.unsubscribe();
  }

  getMyDetailsData() {
    this.sharedService.showLoader();
    this.myDetailsService.getMyDetailsData().subscribe(
      result => {
        const status = this.contentService.validateResponse(result, {});
        this.sharedService.handleUnexpectedResponse(status);
        if (status === 'success') {
          this.contentService.setTemplate(result);
          this.contentService.setBasicData(result);
          this.myDetails = result;
          this.securityQuestions = _.get(this.myDetails, 'profileInformation.secretQuestions', []);
          this.profileImage = _.get(this.myDetails, 'profileInformation.avatar', '');
          this.myDetail = this.setMyDetailFormData();
          const countryCode = _.get(this.myDetail, 'value.parentISD', '+91');
          this.setCountry(countryCode);
        }
        this.sharedService.hideLoader();
      },
      responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
    );
  }

  initializeMyDetailFormData() {
    return new FormGroup({
      dateOfBirth: new FormControl(''),
      monthOfBirth: new FormControl(''),
      yearOfBirth: new FormControl(''),
      motherName: new FormControl(''),
      fatherName: new FormControl(''),
      parentEmail: new FormControl(''),
      parentMobile: new FormControl(''),
      parentISD: new FormControl(''),
      securityQuestion: new FormControl(''),
      securityAns: new FormControl('')
    });
  }

  setMyDetailFormData() {
    let dateOfBirth: any;
    const motherName = _.get(this.myDetails, 'profileInformation.parentDetails.mother.name', '');
    const fatherName = _.get(this.myDetails, 'profileInformation.parentDetails.father.name', '');
    const parentEmail = _.get(this.myDetails, 'profileInformation.parentDetails.parent.email.email', '');
    const parentISD = _.get(this.myDetails, 'profileInformation.parentDetails.parent.mobile.extension', '');
    const parentMobile = _.get(this.myDetails, 'profileInformation.parentDetails.parent.mobile.number', '');
    const securityQuestion = _.get(this.myDetails, 'profileInformation.selectedQuest', '');
    const securityAns = _.get(this.myDetails, 'profileInformation.secretAnswer', '');
    let dob: any = _.get(this.myDetails, 'profileInformation.dob', '');
    if (dob !== '') {
      dob = dob.split('-');
      dateOfBirth = {
        year: parseInt(dob[0], 10),
        month: parseInt(dob[1], 10),
        date: parseInt(dob[2], 10)
      };
    } else {
      dateOfBirth = {
        year: 0,
        month: 0,
        date: 0
      };
    }

    return new FormGroup({
      dateOfBirth: new FormControl(dateOfBirth.date),
      monthOfBirth: new FormControl(dateOfBirth.month),
      yearOfBirth: new FormControl(dateOfBirth.year),
      motherName: new FormControl(motherName, Validators.pattern('^[a-z A-Z]+$')),
      fatherName: new FormControl(fatherName, Validators.pattern('^[a-z A-Z]+$')),
      parentEmail: new FormControl(parentEmail,
        Validators.pattern('^[a-z0-9\\+_\\-]+[a-z0-9\\+_\\-\\.]*@[a-z0-9\\-]+\.[a-z0-9\\-\\.]*[a-z]{2,6}$')),
      parentMobile: new FormControl(parentMobile, Validators.pattern('^[0-9]{8,12}$')),
      parentISD: new FormControl(parentISD),
      securityQuestion: new FormControl(securityQuestion),
      securityAns: new FormControl(securityAns)
    }, DOBValidator.checkDOB);
  }

  getFormElement(elem) {
    return this.myDetail.get(elem);
  }

  updateMyDetails() {
    if (!this.checkMyDetailIsInvalid()) {
      const data = Object.assign({}, this.myDetail.value);
      data.dateOfBirth = data.yearOfBirth + '-' + this.sharedService.padPrefix(data.monthOfBirth, 2, '0') +
        '-' + this.sharedService.padPrefix(data.dateOfBirth, 2, '0');
      delete data.yearOfBirth;
      delete data.monthOfBirth;
      this.updateMyDetailsData(data, this.successDetails);
    }
  }

  updateMyDetailsData(data, successDetails) {
    this.sharedService.showLoader();
    this.myDetailsService.updateMyDetailsData(data).subscribe(
      result => {
        const status = this.contentService.validateResponse(result, data);
        this.sharedService.handleUnexpectedResponse(status);
        if (status === 'success') {
          this.sharedService.hideLoader();
          this.getMyDetailsData();
          this.sharedService.open(successDetails);
        }
      },
      responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
    );
  }

  createDateRange(type: string) {
    switch (type) {
      case 'date':
        this.generateDate();
        break;
      case 'month':
        this.generateMonth();
        break;
      case 'year':
        this.generateYear();
        break;
      default:
        this.generateDate();
        break;
    }
    return this.items;
  }

  generateDate() {
    this.items = [];
    for (let i = 1; i < 32; i++) {
      this.items.push(i);
    }
  }

  generateMonth() {
    this.items = [];
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    this.items = months;
  }

  generateYear() {
    const serverDate: any = _.get(this.myDetails, 'today', '');
    const date = new Date();
    const systemYear = date.getFullYear();
    const year: number = (serverDate && (serverDate.split('-'))[0] !== '') ? (serverDate.split('-'))[0] : systemYear;
    this.items = [];
    const max_year = year - 4;
    for (let i = max_year; i >= AppSettings.DOB_MIN_YEAR; i--) {
      this.items.push(i);
    }
  }

  checkMyDetailIsInvalid() {
    return this.myDetail.invalid || this.myDetail.untouched;
  }

  uploadProfilePic() {
    this.sharedService.showLoader();
    let profilePicError = '';
    const maxFileUpload = AppSettings.MAX_IMAGE_SIZE;
    if (this.avatarFile) {
      const file = this.avatarFile.nativeElement;
      if (file.files && file.files[0]) {
        const uploadFile = file.files[0];
        if (this.sharedService.checkFileExtension(uploadFile.type, 'image')) {
          const fileSize = uploadFile.size / 1024;
          if (fileSize <= maxFileUpload * 1024) {
            const formData = new FormData();
            formData.append('avatarFile', uploadFile);
            this.myDetailsService.uploadProfilePic(formData).subscribe(
              result => {
                const status = this.contentService.validateResponse(result, {});
                this.sharedService.handleUnexpectedResponse(status);
                if (status === 'success') {
                  this.basicData.userInformation.avatar =
                    this.profileImage = this.myDetails.profileInformation.avatar = _.get(result, 'avatar', '');
                  this.contentService.setBasicData(this.basicData);
                } else if (status === 'upload_failure') {
                  profilePicError = 'Profile picture upload failed.';
                }
                this.setProfilePicError(profilePicError, true);
              },
              responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
            );
          } else {
            profilePicError = 'File size should not be greater than ' + maxFileUpload + 'MB.';
          }
        } else {
          const acceptedTypes = AppSettings.IMAGE_FORMAT.join(' or ');
          profilePicError = 'Upload only files of type ' + acceptedTypes + '.';
        }
      } else {
        this.sharedService.hideLoader();
        console.log('No file selected.');
      }
    }
    this.setProfilePicError(profilePicError);
  }

  private setProfilePicError(profilePicError: string, forceHideLoader?: boolean) {
    if (forceHideLoader) { this.sharedService.hideLoader(); }
    if (profilePicError !== '') {
      if (!forceHideLoader) { this.sharedService.hideLoader(); }
      this.profilePicError = profilePicError;
      setTimeout(() => this.profilePicError = '', 3000);
    }
  }

  imageError() {
    const profileInfo = _.get(this.myDetails, 'profileInformation', null);
    if (profileInfo) {
      const image: string = this.sharedService.setDefaultProfilePic(profileInfo);
      this.profileImage = this.myDetails.profileInformation.avatar = image;
    }
  }

  toggleCountryDropdown() {
    const dropdownClass: string[] = _.get(this.countryDropdown, 'nativeElement.classList', []);
    this.toggleClass(dropdownClass, 'active');
  }

  selectCountry(country) {
    const dropdownMenuClass: string[] = _.get(this.countryDropdownMenu, 'nativeElement.classList', []);
    this.setSelectedCountryName(country);
    this.myDetail.value.parentISD = country[2];
    this.myDetail.markAsTouched();
    this.toggleClass(dropdownMenuClass, 'showMenu');
    this.toggleCountryDropdown();
  }

  private isEmptyContent(data) {
    return (data === '' || data === null || data === undefined);
  }

  setCountry(code) {
    if (code !== '') {
      let country;
      _.forEach(this.countries, function (value) {
        if (value[2] === code) {
          country = value;
        }
      });
      this.setSelectedCountryName(country);
    }
  }
  private setSelectedCountryName(country: any) {
    const dropdownNativeElement: string = _.get(this.countryDropdown, 'nativeElement', '');
    const countryText = `<span class="` + country[1] + ` flag"></span><span class="code">` + country[2] + `</span>`;
    if (!_.isEmpty(dropdownNativeElement)) {
      this.countryDropdown.nativeElement.innerHTML = countryText;
    }
  }

  private toggleClass(classList, className) {
    classList.toggle(className);
    return classList;
  }

}
