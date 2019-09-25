import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'comment'
})
export class CommentPipe implements PipeTransform {

  transform(value: any, args?: any): string {
    let key = value.lastIndexOf("\\");
    let fileName = value.substring(key + 1)
    return fileName;
  }
}