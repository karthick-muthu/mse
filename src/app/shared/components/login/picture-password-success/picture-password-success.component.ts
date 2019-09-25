import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { AppSettings } from '../../../../settings/app.settings';

@Component({
  selector: 'ms-picture-password-success',
  templateUrl: './picture-password-success.component.html',
  styleUrls: ['./picture-password-success.component.scss']
})
export class PicturePasswordSuccessComponent implements OnInit {

  @Input() newPasswordA: string;
  @Input() newPasswordB: string;


  animalPassword: any;
  animalPasswordPics: any;
  foodPassword: any;
  foodPasswordPics: any;
  constructor() { }

  ngOnInit() {
    this.animalPassword = AppSettings.ANIMAL_PASSWORD;
    this.animalPasswordPics = _.values(this.animalPassword);
    this.foodPassword = AppSettings.FOOD_PASSWORD;
    this.foodPasswordPics = _.values(this.foodPassword);
  }

}
