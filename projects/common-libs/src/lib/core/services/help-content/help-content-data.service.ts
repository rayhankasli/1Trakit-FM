/**
 * @author Mayur Patel
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
// -----------------------------------------//
import { HelpContent } from '../../models/core.model';

/**
 * HelpContentDataService
 */
@Injectable()
export class HelpContentDataService {
  /** helpContents */
  private helpContents: HelpContent[];
  constructor() {
    this.helpContents = [];
  }

  /** getAllHelpContents */
  public getAllHelpContents(responseData: HelpContent[]): Observable<HelpContent[]> {
    this.helpContents = responseData.filter((item: any) => {
      if (item.fields.__typename === 'helpContent') {
        return item;
      }
    }).map((filteredItem: any) => {
      return this.helpContentAdapter(filteredItem.fields);
    });
    let sortedItem: HelpContent[] = this.helpContents.sort((firstValue: HelpContent, secondValue: HelpContent) => {
      return firstValue.index - secondValue.index;
    });
    return of(sortedItem);

  }

  /** helpContentAdapter */
  private helpContentAdapter(helpContentInfo: HelpContent): HelpContent {
    return new HelpContent(helpContentInfo.index, helpContentInfo.question, helpContentInfo.answer);
  }
}
