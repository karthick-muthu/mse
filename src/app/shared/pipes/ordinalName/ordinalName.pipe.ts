import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordinalName'
})
export class OrdinalNamePipe implements PipeTransform {

  transform(value: any): any {
    value = parseInt(value, 10);
    const ordinals = ['th', 'st', 'nd', 'rd'];
    const v = value % 100;
    return value + (ordinals[(v - 20) % 10] || ordinals[v] || ordinals[0]);
  }

}
