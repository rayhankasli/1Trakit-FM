/**
 * LanguageService
 * @author Nitesh Sharma
 * @description This service will used for global setting of language and culture
 */
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { takeUntil } from 'rxjs/operators/takeUntil';
//--------------------------------------------------------//
import { BreakPointEnum } from '../../models/core.model';
// import { BreakPointEnum } from 'common-libs';

/** BreakPointObserverService */
@Injectable()
export class BreakPointObserverService implements OnDestroy {

    /** deviceObserver  */
    public deviceObserver$: Observable<BreakPointEnum>;
    /** deviceObserver */
    private deviceObserver: BehaviorSubject<BreakPointEnum>;

    /** create for destroy */
    private destroy: Subject<boolean>;

    constructor(private breakPointObserver: BreakpointObserver) {
        this.deviceObserver = new BehaviorSubject(null);
        this.destroy = new Subject();
        this.deviceObserver$ = this.deviceObserver.asObservable();
        this.observeBreakPoint();
    }

    /**
     * ngOnDestroy
     */
    public ngOnDestroy(): void {
        this.destroy.next(true);
        this.destroy.unsubscribe();
    }

    /**
     * observeBreakPoint
     */
    private observeBreakPoint(): void {
        this.breakPointObserver.observe('(max-width: 767px)').pipe(takeUntil(this.destroy)).subscribe((res: BreakpointState) => {
            if (res.matches) {
                this.deviceObserver.next(BreakPointEnum.IsMobile);
            }
            else {
                this.deviceObserver.next(BreakPointEnum.IsDesktop);
            }
        });
    }
}




