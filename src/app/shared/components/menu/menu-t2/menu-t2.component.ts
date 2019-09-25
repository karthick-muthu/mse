import { Component, OnInit, OnChanges, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import * as _ from 'lodash';

@Component({
  selector: 'ms-menu-t2',
  templateUrl: './menu-t2.component.html',
  styleUrls: ['./menu-t2.component.scss']
})
export class MenuT2Component implements OnInit, OnChanges {
  @Input() menuList: any;
  menus: any = {};
  collapseMenu = true;

  constructor( @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
  }

  ngOnChanges(changes: any): void {
    const changesValue = _.get(changes, 'menuList.currentValue', null);
    if (changesValue !== undefined && changesValue !== null) {
      this.menuList = changesValue;
      this.menus = this.menuList;
    }
  }

  toggleMenu() {
    this.collapseMenu = !this.collapseMenu;
    if (window.innerWidth < 768) {
      this.document.body.classList.toggle('body-fixed');
    }
  }

}
