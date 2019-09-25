import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { LoginSettings } from '../../../../settings/login.settings';
import { Subscription } from 'rxjs/Subscription';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'ms-product-selection',
  templateUrl: './product-selection.component.html',
  styleUrls: ['./product-selection.component.scss']
})
export class ProductSelectionComponent implements OnInit, OnDestroy {

  firstName: any;
  productListSubscription: Subscription;
  page: any;
  language: any;
  productList: any;
  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router,
    private loginService: LoginService) {
    this.authService.setBeforeUnloadRestrict('blockReload');
    this.language = _.get(this.activatedRoute, 'params.value.lang', 'en').toLowerCase();
    this.authService.setSiteTitle('Product Selection');
    this.authService.setPopState('otherPages');
    this.authService.setRouteLang(this.language);
    this.authService.changeLanguageRoute(this.language);
    this.productListSubscription = this.authService.getProductList().subscribe(result => {
      this.productList = result.productList;
      this.firstName = result.firstName;
    });
    this.authService.getReloadRestrict().subscribe(result => {
      this.page = result.page;
      if (this.page !== 'login') {
        const url = this.language + '/error/reload';
        this.router.navigate([url]);
      }
    });
  }

  ngOnInit() {
  }

  getProductImage(product) {
    let image = '';
    product = product.toLowerCase();
    if (product === LoginSettings.PRODUCT_LIST[0]) {
      image = LoginSettings.PRODUCTS_IMAGES[0];
    } else if (product === LoginSettings.PRODUCT_LIST[1]) {
      image = LoginSettings.PRODUCTS_IMAGES[1];
    } else if (product === LoginSettings.PRODUCT_LIST[2]) {
      image = LoginSettings.PRODUCTS_IMAGES[2];
    } else {
      image = LoginSettings.PRODUCTS_IMAGES[0];
    }
    return image;
  }

  productSelected(product) {
    const selectedProduct = this.productList[product];
    this.authService.showLoader();
    this.loginService.getLandingPage(selectedProduct);
    this.authService.hideLoader();
  }

  ngOnDestroy() {
    this.productListSubscription.unsubscribe();
  }
}
