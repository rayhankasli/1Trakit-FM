
/**  
 * @author Nitesh Sharma 
 */
import { Injectable } from '@angular/core';
import { NgbTimeStruct, NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';

const pad = (i: number): string => i < 10 ? `0${i}` : `${i}`;
/**
 * Example of a String Time adapter
 */
@Injectable()
export class NgbTimeStringAdapter extends NgbTimeAdapter<string> {

  /**
   * Froms model
   * @param value 
   * @returns model 
   */
  public fromModel(value: string | null): NgbTimeStruct {
    if (!value) {
      return null;
    }
    const split: string[] = value.toString().split(':');
    return {
      hour: parseInt(split[0].replace(/[^\x00-\x7F]/g, ''), 10),
      minute: parseInt(split[1].replace(/[^\x00-\x7F]/g, ''), 10),
      second: 0
    };
  }

  /**
   * To model
   * @param time 
   * @returns date of model 
   */
  public toModel(time: NgbTimeStruct | null): string | null {
    const asd  = time != null ? `${pad(time.hour)}:${pad(time.minute)}` : null;
    return time != null ? `${pad(time.hour)}:${pad(time.minute)}` : null;
  }
}
