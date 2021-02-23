/**
* @description: Provider for Toastr, helps to bind messages to the Toastr.
* @class: ToastrServiceProvider
*
*/

import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class ToastrServiceProvider {

    TOASTR_TYPE: Object = {};
    constructor(
        private _toastrService: ToastrService,
    ) {
    }

    // CONVERT TO UN ORDERED LIST IF ARRAY.
    protected convertToList(message: any) {
        if (message instanceof Array) {       // GET ALL MESSAGES FROM ARRAY.

            let list = `<ul class="toast-msg-list">`;
            message.forEach(element => {
                if (element instanceof Object) {  // IF ITEM IS OBJECT - GET VALUE.
                    const info = element[Object.keys(element)[0]];
                    list += `<li class="toast-msg">${info}</li>`;
                } else {                          // SET STRING ITEM AS MESSAGE.
                    list += `<li class="toast-msg">${element}</li>`;
                }
            });
            list += `</ul>`;
            return list;

        } else if (message instanceof Object) { // IF ITEM IS OBJECT - GET VALUE.

            let list = `<ul class="toast-msg-list">`;
            Object.keys(message).forEach(element => {
                if (message[element]) {
                    const messageString = message[element];
                    list += `<li class="toast-msg">${messageString}</li>`;
                }
            });
            list += `</ul>`;
            return list;

        } else {                              // IF MESSAGE IS SINGLE STRING.
            return message;
        }
    }

    /**
     * SHOW MESSAGE(S)
     * @param message OBJECT | ANY[]
     * @param title STRING
     */
    show(message?: Object | any[] | string, title?: string) {
        this._toastrService.show(this.convertToList(message), title);
    }

    /**
     * SHOW SUCCESS MESSAGE(S)
     * @param message OBJECT | ANY[]
     * @param title STRING, DEFAULT: Success
     */
    success(message?: Object | any[] | string, title: string = this.TOASTR_TYPE['SUCCESS'] || 'Success') {
        this._toastrService.success(this.convertToList(message), title);
    }

    /**
     * SHOW ERROR MESSAGE(S)
     * @param message OBJECT | ANY[]
     * @param title STRING, DEFAULT: Error
     */
    error(message?: Object | any[] | string, title: string = this.TOASTR_TYPE['ERROR'] || 'Error') {
        this._toastrService.error(this.convertToList(message), title);
    }

    /**
     * SHOW INFORMATION MESSAGE(S)
     * @param message OBJECT | ANY[]
     * @param title STRING, DEFAULT: Note
     */
    info(message?: Object | any[] | string, title: string = this.TOASTR_TYPE['NOTE'] || 'Note') {
        this._toastrService.info(this.convertToList(message), title);
    }

    /**
     * SHOW WARNING MESSAGE(S)
     * @param message OBJECT | ANY[]
     * @param title STRING, DEFAULT: Warning
     */
    warning(message?: Object | any[] | string, title: string = this.TOASTR_TYPE['WARNING'] || 'Warning') {
        this._toastrService.warning(this.convertToList(message), title);
    }

}
