import {INavEvent} from '../../../../projects/ngx-jalali-date-picker/src/lib/common/models/navigation-event.model';
import moment from'jalali-moment';
import {Moment} from 'jalali-moment';
import {
  DatePickerComponent,
  DatePickerDirective,
  IDay,
  ISelectionEvent
} from '../../../../projects/ngx-jalali-date-picker/src/public-api';
import {Directive, ViewChild} from '@angular/core';
import {UntypedFormControl, ValidatorFn, Validators} from '@angular/forms';

@Directive()
export abstract class DateComponent {
  @ViewChild('dateComponent') dateComponent: DatePickerComponent;
  @ViewChild(DatePickerDirective) dateDirective: DatePickerDirective;

  control: UntypedFormControl;

  abstract config;
  date = moment();
  material: boolean = true;
  required: boolean = false;
  disabled: boolean = false;
  validationMinDate: Moment;
  validationMaxDate: Moment;
  validationMinTime: Moment;
  validationMaxTime: Moment;
  placeholder: string = 'Choose a date...';
  displayDate: Moment;

  displayDateChanged(displayDate: Moment): void {
    this.displayDate = displayDate;
  }

  onDisplayDateChange(displayDate: Moment): void {
    this.displayDate = displayDate;
  }

  onMaterialThemeChange(material: boolean): void {
    this.material = material;
  }

  onDisabledChange(disabled: boolean): void {
    this.disabled = disabled;
    disabled ? this.control.disable() : this.control.enable();
  }

  onRequireValidationChange(required: boolean): void {
    this.required = required;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  onMinValidationChange($event: Moment): void {
    this.validationMinDate = $event;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  onMaxValidationChange($event: Moment): void {
    this.validationMaxDate = $event;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  onMinTimeValidationChange($event: Moment): void {
    this.validationMinTime = $event;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  onMaxTimeValidationChange($event: Moment): void {
    this.validationMaxTime = $event;
    this.control.setValidators(this.getValidations());
    this.control.updateValueAndValidity();
  }

  onPlaceholderChange(placeholder: string): void {
    this.placeholder = placeholder;
  }

  onConfigChange($event): void {
    this.config = {
      ...this.config,
      ...$event
    }
  }

  openCalendar(): void {
    (this.dateComponent || this.dateDirective).api.open();
  }

  closeCalendar(): void {
    (this.dateComponent || this.dateDirective).api.close();
  }

  moveCalendarTo($event: Moment): void {
    (this.dateComponent || this.dateDirective).api.moveCalendarTo($event);
  }

  onLeftNav(change: INavEvent) {
    console.log('left nav', change);
  }

  onRightNav(change: INavEvent) {
    console.log('right nav', change);
  }

  opened() {
    console.log('opened');
  }

  closed() {
    console.log('closed');
  }

  onSelect(data: any) {
    console.log(data);
  }

  log(item) {
    // console.log(item);
  }

  protected buildForm(): UntypedFormControl {
    return new UntypedFormControl({value: this.date, disabled: this.disabled}, this.getValidations());
  }

  private getValidations(): ValidatorFn[] {
    return [
      this.required ? Validators.required : () => undefined,
      (control) => {
        return this.validationMinDate && this.config &&
        moment(control.value, this.config.format)
          .isBefore(this.validationMinDate)
          ? {minDate: 'minDate Invalid'} : undefined
      },
      (control) => {
        return this.validationMaxDate && this.config &&
        moment(control.value, this.config.format)
          .isAfter(this.validationMaxDate)
          ? {maxDate: 'maxDate Invalid'} : undefined
      },
      (control) => {
        return this.validationMinTime && this.config &&
        moment(control.value, this.config.format)
          .isBefore(this.validationMinTime)
          ? {minDate: 'minDate Invalid'} : undefined
      },
      (control) => {
        return this.validationMaxTime && this.config &&
        moment(control.value, this.config.format)
          .isAfter(this.validationMaxTime)
          ? {maxDate: 'maxDate Invalid'} : undefined
      }
    ].filter(Boolean);
  }
}
