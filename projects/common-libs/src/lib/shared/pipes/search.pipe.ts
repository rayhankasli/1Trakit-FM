/** 
 * @author  Mayur Patel
 */
import { Pipe, PipeTransform } from '@angular/core';
import { HelpContent } from '../../core/models/core.model';

/**
 * SearchPipe
 */
@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  /**
   * Transforms search pipe
   * @param value 
   * @param searchText 
   * @returns transform 
   */
  public transform(value: HelpContent[], searchText: string): HelpContent[] {
    if (!value) { return []; }
    if (!searchText) { return value; }

    searchText = searchText.toLowerCase();

    return value.filter((it: HelpContent) => {
      return it.question.toLowerCase().includes(searchText);
    });

  }

}
