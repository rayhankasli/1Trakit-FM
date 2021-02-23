/** 
 * @author Nitesh SHarma 
 */

import { AbstractControl } from '@angular/forms';

export type ErrorOptions = string | string[];

/**
 * Error details
 */
export interface ErrorDetails {
  /**
   * control
   */
  control: AbstractControl,
  /**
   * errorName
   */
  errorName: string
}