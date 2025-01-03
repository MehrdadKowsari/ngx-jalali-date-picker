import {Injectable} from '@angular/core';
import moment from 'jalali-moment';
import {Moment} from 'jalali-moment';
import {UtilsService} from '../common/services/utils/utils.service';
import {IMonth} from './month.model';
import {IMonthCalendarConfig, IMonthCalendarConfigInternal} from './month-calendar-config';

@Injectable()
export class MonthCalendarService {
  readonly DEFAULT_CONFIG: IMonthCalendarConfigInternal = {
    allowMultiSelect: false,
    yearFormat: 'YYYY',
    format: 'MMMM-YYYY',
    isNavHeaderBtnClickable: false,
    monthBtnFormat: 'MMMM',
    locale: 'fa',
    multipleYearsNavigateBy: 10,
    showMultipleYearsNavigation: false,
    unSelectOnClick: true
  };
  readonly GREGORIAN_DEFAULT_CONFIG: IMonthCalendarConfig = {
    format: 'MM-YYYY',
    monthBtnFormat: 'MMM',
    locale: 'en'
  };

  constructor(private utilsService: UtilsService) {
  }

  getConfig(config: IMonthCalendarConfig): IMonthCalendarConfigInternal {
    const _config = <IMonthCalendarConfigInternal>{
      ...this.DEFAULT_CONFIG,
      ...((config && config.locale && config.locale !== 'fa') ? this.GREGORIAN_DEFAULT_CONFIG : {}),
      ...this.utilsService.clearUndefined(config)
    };

    this.utilsService.convertPropsToMoment(_config, _config.format, ['min', 'max'], _config.locale);

    // moment.locale(_config.locale);

    return _config;
  }

  generateYear(config: IMonthCalendarConfig, year: Moment, selected: Moment[] = null): IMonth[][] {
    const index = year.clone().startOf('year');

    return this.utilsService.createArray(3).map(() => {
      return this.utilsService.createArray(4).map(() => {
        const date = index.clone();
        const month = {
          date,
          selected: !!selected.find(s => index.isSame(s, 'month')),
          currentMonth: index.isSame(moment(), 'month'),
          disabled: this.isMonthDisabled(date, config),
          text: this.getMonthBtnText(config, date)
        };

        index.add(1, 'month');

        return month;
      });
    });
  }

  isMonthDisabled(date: Moment, config: IMonthCalendarConfig) {
    if (config.min && date.isBefore(config.min, 'month')) {
      return true;
    }

    return !!(config.max && date.isAfter(config.max, 'month'));
  }

  shouldShowLeft(min: Moment, currentMonthView: Moment): boolean {
    return min ? min.isBefore(currentMonthView, 'year') : true;
  }

  shouldShowRight(max: Moment, currentMonthView: Moment): boolean {
    return max ? max.isAfter(currentMonthView, 'year') : true;
  }

  getHeaderLabel(config: IMonthCalendarConfig, year: Moment): string {
    if (config.yearFormatter) {
      return config.yearFormatter(year);
    }
    year.locale(config.locale);
    return year.format(config.yearFormat);
  }

  getMonthBtnText(config: IMonthCalendarConfig, month: Moment): string {
    if (config.monthBtnFormatter) {
      return config.monthBtnFormatter(month);
    }

    return month.format(config.monthBtnFormat);
  }

  getMonthBtnCssClass(config: IMonthCalendarConfig, month: Moment): string {
    if (config.monthBtnCssClassCallback) {
      return config.monthBtnCssClassCallback(month);
    }

    return '';
  }
}
