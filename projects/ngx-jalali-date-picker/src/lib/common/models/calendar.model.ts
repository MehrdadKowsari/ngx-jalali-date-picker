import {Moment} from 'jalali-moment';
import {SingleCalendarValue} from '../types/single-calendar-value';

export interface ICalendar {
  locale?: string;
  min?: SingleCalendarValue;
  max?: Moment;
}

export interface ICalendarInternal {
  locale?: string;
  min?: Moment;
  max?: Moment;
}
