/** 
 * ValidationRegex
 * @author Nitesh Sharma 
 */
export enum ValidationRegex {
    Name = '[a-zA-Z]+([\s][a-zA-Z]+)*',
    MobileNumber = '/^\(?([2-9]{1}[0-9]{2})\)?[ ]?([0-9]{3})[-. ]?([0-9]{4})$/',
    Email = '/(.+)@(.+){2,}\.(.+){2,}/',
    Digit = '^[0-9]+$'
}