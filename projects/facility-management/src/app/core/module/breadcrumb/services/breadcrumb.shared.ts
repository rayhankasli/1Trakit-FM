import template from 'lodash.template';
import * as templateSettings from 'lodash.templatesettings';
// -------------------------------------------------- //
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';

const _ = {
  template: template,
  templateSettings: templateSettings
};

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

export interface IBreadcrumb {
  text: string;
  path: string;
  className: string;
}

declare var require: any;

function r(module) {
  return require(`${name}`);
}

export function stringFormat(templateHTML: string, binding: any): string {
  const compiled = _.template(templateHTML);
  return compiled(binding);
}

export function isPromise(value: any): boolean {
  return value && typeof value.then === 'function';
}

export function wrapIntoObservable<T>(
  value: T | Promise<T> | Observable<T>
): Observable<T> {
  if (value instanceof Observable) {
    return value;
  }

  if (isPromise(value)) {
    return from(Promise.resolve(value));
  }

  return of(value as T);
}
