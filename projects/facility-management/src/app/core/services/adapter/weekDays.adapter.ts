import { Injectable } from '@angular/core';
// ----------------------------------------- //
import { Adapter } from 'common-libs';
import { WeekDays } from '../../model/common.model';
import { Repeat_Type } from '../../model/repeats-on.model';

@Injectable()
export class WeekDaysAdapter implements Adapter<WeekDays[]>{

    /** This method is used to transform response object into T object. */
    public toResponse(items: WeekDays[]): WeekDays[] {
        let weekDays: WeekDays[] = this.getWeekDays(items);
        return weekDays;
    }

    /**
     * Return filtered weekdays from API response
     * @param weekDays Week days[]
     */
    private getWeekDays(weekDays: WeekDays[] = []): WeekDays[] {
        return weekDays.filter((item: WeekDays) => item.repeatType === Repeat_Type.WEEKLY);
    }
}