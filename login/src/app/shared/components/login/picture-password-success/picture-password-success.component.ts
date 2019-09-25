import { Component, OnInit, Input } from '@angular/core';
import { LoginSettings } from '../../../../settings/login.settings';
import * as _ from 'lodash';
import { AuthService } from '../../../../modules/auth/services/auth/auth.service';

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
  successAnimalPassword: string;
  successFoodPassword: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.animalPassword = LoginSettings.ANIMAL_PASSWORD;
    this.animalPasswordPics = _.values(this.animalPassword);
    this.foodPassword = LoginSettings.FOOD_PASSWORD;
    this.foodPasswordPics = _.values(this.foodPassword);
    this.successAnimalPassword = this.animalPassword[this.newPasswordA];
    this.successFoodPassword = this.foodPassword[this.newPasswordB];
  }

}
