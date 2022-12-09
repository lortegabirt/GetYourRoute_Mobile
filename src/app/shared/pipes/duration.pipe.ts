import { Pipe, PipeTransform } from '@angular/core';
import {intervalToDuration} from 'date-fns';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(ms: number): string {
    const duration = intervalToDuration({start: new Date(0), end: new Date(ms)});
    const hours = duration.hours.toString().padStart(2, '0');
    const minutes = duration.minutes.toString().padStart(2, '0');
    const seconds = duration.seconds.toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

}
