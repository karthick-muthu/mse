import { Component, OnInit } from '@angular/core';
import { CommentPipe } from './filters/comment.pipe';

@Component({
  selector: 'ms-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  providers: [CommentPipe]
})
export class CommentsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
