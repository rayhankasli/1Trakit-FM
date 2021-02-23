/**
 * @author Mayur Patel
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';
// --------------------------------------------- //
import { Language } from '../../models/core.model';

/**
 * LanguageDataService
 */
@Injectable()
export class LanguageDataService {
  /** Observable to emit changed language. */
  public languageChange$: Observable<string>;
  /** Property to store Default language */
  public defaultLanguage: string;

  /** Property to inform all the subscribers that language has been changed. */
  private languageChange: BehaviorSubject<string>;
  /** languages */
  private languages: Language[];
  constructor() {
    this.languages = [];
    this.languageChange = new BehaviorSubject<string>(null);
    this.defaultLanguage = 'en-us';
    this.languageChange$ = this.languageChange.asObservable();
  }

  /** getAllLanguages */
  public getAllLanguages(responseData: Language[]): Observable<Language[]> {
    this.languages = responseData.map((item: Language) => {
      return this.languageAdapter(item);
    });
    let sortedItem: Language[] = this.languages.sort((firstValue: Language, secondValue: Language) => {
      return firstValue.index - secondValue.index;
    });
    return of(sortedItem);
  }

  /**
   * Updates language when user change the dropDown option
   * @param langCode accept change language code
   */
  public updateLanguage(langCode: string): void {
    this.languageChange.next(langCode);
    this.defaultLanguage = langCode;
  }
  /** languageAdapter */
  private languageAdapter(languageInfo: Language): Language {
    return new Language(languageInfo.index, languageInfo.name, languageInfo.code);
  }
}
