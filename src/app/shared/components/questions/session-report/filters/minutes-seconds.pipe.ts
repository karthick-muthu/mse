import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesSeconds'
})
export class MinutesSecondsPipe implements PipeTransform {
  filteredTime: string;
  transform(value: any, args?: any): any {
    const tempSecs: number = Number(value);

    const seconds = Math.floor(tempSecs % 3600 % 60);
    const mins = Math.floor(value % 3600 / 60);
    if (tempSecs > 60) {
      if (mins > 1) {
        if (seconds === 1) {
          this.filteredTime = mins + ' mins ' + seconds + ' sec';
        } else {
          this.filteredTime = mins + ' mins ' + seconds + ' secs';
        }

      } else {
        this.filteredTime = mins + ' min ' + seconds + ' secs';
      }
    } else {
      this.filteredTime = tempSecs + ' secs';
    }
    return this.filteredTime;
  }

}
