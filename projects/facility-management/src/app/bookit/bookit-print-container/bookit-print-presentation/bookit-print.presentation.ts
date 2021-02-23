import { AfterViewInit, Component, ElementRef, ViewChild, Input, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
// --------------------------------------------------------- //
import { NgbTimeStringAdapter } from 'common-libs';
// --------------------------------------------------------- //
import { environment } from '../../../../environments/environment';
import { DATE_FORMAT } from '../../../core/utility/constants';
import { BookItPrintPresenter } from '../bookit-print-presenter/bookit-print.presenter';
import { BookIt } from '../../models/bookit.model';
import { CateringCompanyInformation } from '../../models/bookIt-rooms.model';

@Component({
  selector: 'app-bookit-print-presentation-ui',
  templateUrl: './bookit-print.presentation.html',
  viewProviders: [BookItPrintPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookItPrintPresentationComponent implements AfterViewInit {

  @Input() public set bookIt(value: BookIt) {
    if (value) {
      this._bookIt = value;
    }
  }

  public get bookIt(): BookIt {
    return this._bookIt;
  }

  /** print button reference */
  @ViewChild('printBtn', { static: false }) public printBtn: ElementRef;

  /** host path for absolute URL */
  public get host(): string {
    return environment.redirect_uri;
  }

  public get facilities(): string {
    return (this.bookIt.facility || []).map(type => type.facility).join(', ');
  }

  public get amenities(): string {
    return (this.bookIt.amenities || []).map(item => `${item.amenities} [${item.quantity ? item.quantity : 0}]`).join(', ');
  }

  public get caterings(): string {
    return (this.bookIt.catering || []).map(type => type.cateringType).join(', ');
  }

  public get cateringsCompanyContactInformation(): CateringCompanyInformation {
    return (this.bookIt.cateringCompanyInformation);
  }

  public get files(): string {
    return (this.bookIt.uploadedFiles || []).map(type => type.actualFileName).join(', ');
  }

  public dateFormat: string = DATE_FORMAT;

  /** Hold master data */
  private _bookIt: BookIt;

  constructor(
    private location: Location,
    public ngbTimeAdapter: NgbTimeStringAdapter) { }

  public ngAfterViewInit(): void {
    this.printBtn.nativeElement.click();
    this.location.back();
  }

}
