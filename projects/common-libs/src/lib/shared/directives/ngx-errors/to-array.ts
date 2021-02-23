/**  
 * @author Nitesh Sharma 
 */
import { ErrorOptions } from './ngerrors';

export const toArray: (value: ErrorOptions) => string[] = (value: ErrorOptions): string[] => Array.isArray(value) ? value : [value];