import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: any, value: string): any {
    if (items) {
      if (value === undefined) {
        return items;
      }
      return items.filter(function (item) {
        if (item.contentName) {
          return item.contentName.toLowerCase().includes(value.toLowerCase());
        } else {
          return null;
        }
      });
    }
    return null;
  }
}
