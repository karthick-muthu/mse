import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { IMathQuill } from 'mathquill-typescript';
import { MathQuillService } from '../../services/mathquill/mathquill.service';

@Component({
  selector: 'ms-math-button',
  templateUrl: './math-button.component.html',
  styleUrls: ['./math-button.component.scss']
})
export class MathButtonComponent {
  @ViewChild('mathButton') mathButton: ElementRef;
  @Input('mytext') mytext: string;
  @Input('color') color: string;
  @Input('background') background: string;
  @Input('class') class: string;
  mq: IMathQuill;

  constructor(private mathQuillService: MathQuillService) {
    mathQuillService.mqpromise.then((mq: IMathQuill) => {
      this.mq = mq.getInterface(2);
      this.mq.StaticMath(this.mathButton.nativeElement);
      this.mq.StaticMath(this.mathButton.nativeElement).latex(this.mytext);
    });
  }

}
