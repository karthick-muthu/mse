import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getFileName'
})
export class GetFileNamePipe implements PipeTransform {

  transform(value: any): any {
    const valueArray: string[] = value.split('/');
    value = valueArray[valueArray.length - 1];
    value = value.split('?')[0];
    value = value.split('#')[0];
    return value;
  }

}
