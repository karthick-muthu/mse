import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';

@Pipe({
  name: 'sanitizeCode'
})
export class SanitizeCodePipe implements PipeTransform {

  constructor(private sanitized: DomSanitizer) { }

  transform(value: any, args?: any): any {
    const type = _.get(args, 'type', 'html').toLowerCase();
    if (type === 'html') {
      return this.sanitized.bypassSecurityTrustHtml(value);
    }
  }

}
