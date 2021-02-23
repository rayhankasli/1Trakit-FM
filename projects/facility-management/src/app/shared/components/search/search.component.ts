import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
// ---------------------------------------- //

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'trackit-search',
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {

  /** use for button disabled */
  @Input() public set isDisabled(isDisabled: boolean) {
    this._isDisabled = isDisabled;
  }
  public get isDisabled(): boolean {
    return this._isDisabled;
  }

  /** use for minimum string length allow */
  @Input() public set minSearchTextLength(minSearchTextLength: number) {
    this._minSearchTextLength = minSearchTextLength;
  }
  public get minSearchTextLength(): number {
    return this._minSearchTextLength;
  }

  /* Search box placeholder */
  @Input() public placeholder: string = 'Search';

  /* Search box expanded */
  @Input() public isExpanded: boolean = false;


  /** It will emit the search text to its parent component */
  @Output() public searchText: EventEmitter<string>;

  /** search field control object */
  public searchField: FormControl;
  /*  Search Open  */
  public searchIcon: boolean = true;

  /** use for get and set */
  private _isDisabled: boolean;
  /** use for get set */
  private _minSearchTextLength: number = 2;

  constructor() {
    this.searchText = new EventEmitter();
    this.searchField = new FormControl('');
  }

  /** initial hook */
  public ngOnInit(): void {
    this.searchField.valueChanges.pipe(
      filter((str: string) => str.length >= this._minSearchTextLength || str.length === 0),
      debounceTime(500),
      distinctUntilChanged()).subscribe((searchText: string) => {
        // If searchField value blank then API should be called
        if (this.searchField.value !== '' && !this.searchField.value.replace(/\s/g, '').length) {
          return;
        }
        this.searchText.emit(this.searchField.value);
      })
  }

  /** this method call on search button */
  public onSearch(): void {
    this.searchIcon = !this.searchIcon;

    if (this.searchIcon) {
      this.searchField.setValue('');
    }
  }

}
