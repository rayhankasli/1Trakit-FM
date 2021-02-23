import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { BookItMaster, BookIt } from '../../models/bookit.model';
import { BookitFormContainerComponent } from '../../bookit-form-container/bookit-form.container';
import { BookItPrintResolver } from '../../bookit-print.resolver';
import { CoreDataService } from '../../../core/services/core-data.service';
import { UserInfo } from '../../../core/model/core.model';

@Injectable()
export class BookItPrintPresenter implements OnDestroy {

  public info$: Observable<any>;
  private info: BehaviorSubject<any>;
  /** Destroy of customer form presentation component */
  public destroy: Subject<void>;
  /** hold book it master data */
  public bookMasterData: Observable<BookItMaster>;
  /** hold book it master data */
  public bookDataById$: Observable<BookIt>;
  /** hold book it master data */
  public bookDataById: Subject<BookIt>;
  constructor(
    private bookitCommonService: BookItPrintResolver,
  ) {
    this.info = new BehaviorSubject(null);
    this.info$ = this.info;
    this.destroy = new Subject();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** set info */
  public setInfo(info: any): void {
    this.info.next(info);
  }
}
