import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ms-starred-questions-t1',
  templateUrl: './starred-questions-t1.component.html',
  styleUrls: ['./starred-questions-t1.component.scss']
})
export class StarredQuestionsT1Component implements OnInit {
  @Input('favouritesQuestion') favouritesQuestion: any;

  constructor() { }

  ngOnInit() {
  }

}
