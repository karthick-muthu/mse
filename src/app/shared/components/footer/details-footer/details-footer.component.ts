import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ms-details-footer',
  templateUrl: './details-footer.component.html',
  styleUrls: ['./details-footer.component.scss']
})
export class DetailsFooterComponent implements OnInit {
  @Input('template') template;

  constructor() { }

  ngOnInit() {
  }

}
