

/**
 * @name RoomPresentationComponent
 * @author Ronak Patel.
 * @description This is a presentation component for room which contains the ui and business logic
 */

import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, Inject, Input, OnDestroy, OnInit, Output, QueryList, TemplateRef, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------
import { BasePresentation } from '../../../../../../core/base-classes/base.presentation';
import { Room, RoomLayoutMaster, RoomType } from '../../../../office.model';
import { RoomFormPresenter } from '../room-form-presenter/room-form.presenter';

/** 
 * RoomFormPresentationComponent
 */
@Component({
  selector: 'app-room-form-ui',
  templateUrl: './room-form.presentation.html',
  viewProviders: [RoomFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomFormPresentationComponent extends BasePresentation implements OnInit, OnDestroy {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex w-100';

  /** master room-layouts for selected rooms */
  @Input() public set roomLayouts(layouts: RoomLayoutMaster[]) {
    if (layouts) {
      this._roomLayouts = layouts;
      this.roomLayoutForm = this.roomPresenter.buildRoomLayoutArray(layouts);
    }
  }
  public get roomLayouts(): RoomLayoutMaster[] {
    return this._roomLayouts;
  }

  /** This will set the data */
  @Input() public set room(value: Room) {
    if (value) {
      this._room = value;
      this.isOpen = false;
      this.roomFormGroup = this.roomPresenter.bindControlValue(this.roomFormGroup, this._room);
      this.setSelectedRoomLayout();
    }
  }
  public get room(): Room {
    return this._room;
  }

  /** This will set the data */
  @Input() public set roomTypes(value: RoomType[]) {
    if (value) {
      this.roomPresenter.roomTypeList = value;
      this.roomPresenter.setRoomLayoutEnable(this.room && this.room.roomTypeId);
    }
  }
  public get roomTypes(): RoomType[] {
    return this.roomPresenter.roomTypeList;
  }

  /** Customer form group of room form presentation component */
  public roomFormGroup: FormGroup;
  /** Customer form group of room type form presentation component */
  public roomTypeForm: FormGroup;
  /** Room-layout form array */
  public roomLayoutForm: FormArray;
  /** Determines whether form submitted */
  public isFormSubmitted: boolean = false;
  /** Determines whether form submitted */
  public isRoomTypeFormSubmitted: boolean = false;
  /** This property is used for form open on close state */
  public isOpen: boolean;
  /** getter for form-array controls */
  public get roomLayoutFormArray(): AbstractControl[] {
    return (this.roomLayoutForm && this.roomLayoutForm.controls);
  }
  /** flag for enable/disable room-layout */
  public get enableRoomLayout(): boolean {
    return this.roomPresenter.licensedForBookIt && this.roomPresenter.enableRoomLayout;
  }

  /*** Output of room form presentation component */
  @Output() public add: EventEmitter<Room>;
  /*** Output of room type form presentation component */
  @Output() public addRoomType: EventEmitter<RoomType>;
  /*** Output of room form presentation component */
  @Output() public update: EventEmitter<Room>;
  /*** Output of room form presentation component */
  @Output() public cancel: EventEmitter<void>;

  /** ng-select dropdown reference */
  @ViewChildren(NgSelectComponent) public ngSelects: QueryList<NgSelectComponent>;
  /** get ng select reference */
  @ViewChild(NgSelectComponent, { read: NgSelectComponent, static: true }) public ngSelect: NgSelectComponent;

  /** Destroy of room form presentation component */
  private destroy: Subject<void>;
  /** create for getter setter */
  private _room: Room;
  /** This property is use to store Window object. */
  private window: Window;
  /** Room-layouts list master */
  private _roomLayouts: RoomLayoutMaster[];

  constructor(
    private roomPresenter: RoomFormPresenter,
    public viewContainerRef: ViewContainerRef,
    @Inject('Window') window: Window
  ) {
    super();
    this.window = window as Window;
    this.destroy = new Subject();
    this.add = new EventEmitter();
    this.addRoomType = new EventEmitter();
    this.update = new EventEmitter();
    this.cancel = new EventEmitter();
    this.roomFormGroup = this.roomPresenter.buildForm();
    // this.getRoomTypes.emit();
  }

  public ngOnInit(): void {
    this.isOpen = true;
    // This will subscribe the save event and emit to container component
    this.roomPresenter.add$.pipe(takeUntil(this.destroy)).subscribe((room: Room) => {
      if (this.room) {
        this.update.emit(room);
      } else {
        this.add.emit(room);
      }
    });
    this.roomPresenter.addRoomType$.pipe(takeUntil(this.destroy)).subscribe((room: RoomType) => {
      this.addRoomType.emit(room);
    });
    this.window.addEventListener('scroll', this.scroll, true);
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** This is used to save the data */
  public saveRoom(): void {
    this.isFormSubmitted = true;
    this.roomPresenter.saveRoom(this.roomFormGroup, this.roomLayoutForm);
  }
  /** This is used to save the data */
  public saveRoomType(): void {
    this.isRoomTypeFormSubmitted = true;
    this.roomPresenter.saveRoomType(this.roomTypeForm);
  }

  /** create  for handel blur event  */
  public onBlur(): void {
    this.ngSelect.isOpen = this.roomPresenter.onBlur();
  }
  /** crete for handel on change event  */
  public onChange(): void {
    this.roomPresenter.closeTypeForm();
    this.roomPresenter.showHideRoomLayout(this.roomFormGroup, this.roomLayoutForm);
  }
  /** crete for handel on CLOSE event  */
  public onClose(): void {
    this.ngSelect.isOpen = this.roomPresenter.onBlur();
  }

  /** create for add room type */
  // tslint:disable-next-line: no-any
  public addType(addTypeRef: ElementRef, templateRef: TemplateRef<any>, ngSelect: NgSelectComponent): void {
    this.isRoomTypeFormSubmitted = false;
    this.roomTypeForm = this.roomPresenter.buildRoomTypeForm();
    this.roomPresenter.addType(addTypeRef, templateRef, this.viewContainerRef, ngSelect);
  }
  /** close form */
  public onCancel(): void {
    this.cancel.emit();
  }

  /** Set/Unset validation on room-layout selection */
  public onRoomLayoutSelectionChange(layoutCtrl: AbstractControl): void {
    if ((layoutCtrl.value as RoomLayoutMaster).isChecked) {
      layoutCtrl.get('noOfPerson').setValidators([Validators.required, Validators.min(1), Validators.maxLength(10)]);
    } else {
      layoutCtrl.get('noOfPerson').setValidators([]);
    }
    layoutCtrl.get('noOfPerson').updateValueAndValidity();
  }

  /** on scroll event for hide the ng-select dropdown */
  private scroll = (event: any): void => {
    this.ngSelects.forEach((item: NgSelectComponent) => {
      if (item && item.isOpen && event.target.className) {
        const isScrollingInScrollHost: boolean = (event.target.className as string).indexOf('ng-dropdown-panel-items') > -1;
        if (isScrollingInScrollHost) { return; }
        item.close();
      }
    });
  };

  /** set selected room-layout details on edit */
  private setSelectedRoomLayout(): void {
    for (let i: number = 0; i < (this.roomLayoutForm.getRawValue() as RoomLayoutMaster[]).length; i++) {
      const masterLayout: RoomLayoutMaster = (this.roomLayoutForm.getRawValue() as RoomLayoutMaster[])[i];
      const selected: RoomLayoutMaster = this.room.roomLayouts.find((layout: RoomLayoutMaster) => layout.roomLayoutId === masterLayout.roomLayoutId);
      if (selected) {
        this.roomLayoutForm.controls[i].patchValue({ ...selected, isChecked: true });
        this.onRoomLayoutSelectionChange(this.roomLayoutForm.controls[i])
        continue;
      }
    }
  }

}

