import { Pipe, PipeTransform } from '@angular/core';

/** 
 * text search pipe
 * used to search from dropdown options
 * @param items list of items
 * @param text search text
 * @param label to find from particular label
 */
@Pipe({ name: 'textSearch' })
export class TextSearchPipe implements PipeTransform {

  /**
   * transform items to searched result
   * @param items 
   * @param text 
   */
  public transform<T>(items: T[], ...args: string[]): T[] {
    const text: string = args[0];
    const label: string = args[1] || 'label';

    if (!text) {
      return items;
    }

    return items.filter((item: T) => {
      if (item[label] && typeof item[label] === 'string') {
        return item[label].toLowerCase().indexOf(text.toLowerCase()) > -1;
      }
      return false;
    })
  }

}