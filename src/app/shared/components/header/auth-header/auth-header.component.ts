import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ms-auth-header',
  templateUrl: './auth-header.component.html',
  styleUrls: ['./auth-header.component.scss']
})
export class AuthHeaderComponent implements OnInit {
  @Input('template') template;

  constructor() { }

  ngOnInit() {
  }

}
