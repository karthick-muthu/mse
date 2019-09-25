import { Pipe, PipeTransform } from '@angular/core';
import { SharedService } from '../../shared.service';

@Pipe({
  name: 'minuteSecond'
})
export class MinuteSecondPipe implements PipeTransform {

  constructor(private sharedService: SharedService) { }

  transform(time: any, type: string): string {
    let returnTime = '';
    if (time !== (null && undefined)) {
      if (type === 'mmss' || type === 'mmmsss' || type === 'mmss-o' || type === 'mmmsss-o') {
        returnTime = this.transformToMinuteSecond(time, type);
      } else {
        returnTime = this.transformToMinute(time);
      }
    }
    return returnTime;
  }

  transformToMinute(value: number): string {
    let min: number, minutes: string, sec: number;
    min = Math.floor(value / 60);
    if (min === 0) {
      sec = Math.round(value - min * 60);
      minutes = this.generateTimeString(sec, 'sec');
    } else {
      minutes = this.generateTimeString(min, 'min');
    }
    return minutes.trim();
  }

  transformToMinuteSecond(value: number, type: string): string {
    let optional: boolean, minName: string, secName: string, minutes: string, seconds: string;
    optional = (type === 'mmss-o' || type === 'mmmsss-o');
    ({ minName, secName } = this.getNames(type));
    ({ minutes, seconds } = this.getMinutesSeconds(value, optional, minName, secName));
    return minutes + seconds.trim();
  }

  private getNames(type: string) {
    const minName = (type === 'mmmsss' || type === 'mmmsss-o') ? 'minute' : 'min';
    const secName = (type === 'mmmsss' || type === 'mmmsss-o') ? 'second' : 'sec';
    return { minName, secName };
  }

  private getMinutesSeconds(value: number, optional: boolean, minName: string, secName: string) {
    let min: number, sec: number, minutes: string, seconds: string;
    min = Math.floor(value / 60);
    minutes = (optional && min <= 0) ? '' : this.generateTimeString(min, minName, optional);
    sec = Math.round(value - min * 60);
    seconds = (optional && sec <= 0) ? '' : this.generateTimeString(sec, secName, optional);
    return { minutes, seconds };
  }

  private generateTimeString(time: any, type: string, optional?: boolean) {
    let timeText;
    time = (time.toString().indexOf('.') > -1) ? time.toFixed(2) : time;
    time = (optional) ? time : this.sharedService.padPrefix(time, 2, '0');
    timeText = time + ' ' + type;
    timeText += (time > 1) ? 's ' : ' ';
    return timeText;
  }

}
