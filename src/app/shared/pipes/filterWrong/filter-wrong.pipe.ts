import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'filterWrong'
})
export class FilterWrongPipe implements PipeTransform {

  transform(items: any, value: any, args?: any): any {

    if (!value) {
      return items;
    } else {
      return items.filter(function (item) {
        const userAnswer = (item.userAnswer.result) ? item.userAnswer.result : null;
        if (item.contentType.toLowerCase() === 'question' && userAnswer !== null) {
          if (userAnswer.toLowerCase() === 'skip') {

            return true;
          } else if (item.userAnswer.result.toLowerCase() === 'fail' && item.userAnswer.result !== null) {
            return true;
          }
        } else {
          return items;
        }
      });
    }
  }

}
