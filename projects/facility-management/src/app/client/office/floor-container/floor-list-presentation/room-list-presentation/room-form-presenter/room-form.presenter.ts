
/**
 * @name RoomPresenter
 * @author Ronak Patel
 * @description This is a presenter service for room which contains all logic for presentation component
 */

import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ElementRef, Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
//---------------------------------------------------------------------//
import { EMAIL_PATTERN } from '../../../../../../core/utility/constants';
import { Room, RoomLayout, RoomLayoutMaster, RoomType } from '../../../../office.model';
import { ClientDetailPreserveService } from 'projects/facility-management/src/app/client/client-detail-preserve.service';


/** 
 * RoomFormPresenter 
 */
@Injectable()
export class RoomFormPresenter {

    /** check if client have requested for BookIt */
    public licensedForBookIt: boolean;
    /** enable/disable room-layout */
    public enableRoomLayout: boolean;
    /** list of available room-type */
    public roomTypeList: RoomType[];
    /** This is used for subscribing the value of subject add */
    public add$: Observable<Room>;
    /** This is used for subscribing the value of subject add */
    public addRoomType$: Observable<RoomType>;
    /** This is used for subscribing the value of subject add */
    private add: Subject<Room> = new Subject();
    /** This is used for subscribing the value of subject add */
    private addRoomType: Subject<RoomType> = new Subject();
    /** store overlay reference */
    private overlayRef: OverlayRef;
    private readonly ROOM_TYPE_CONFERENCE: string = 'conference';
    constructor(
        private fb: FormBuilder,
        private overlay: Overlay,
        private clientDetailPreserver: ClientDetailPreserveService
    ) {
        this.add$ = this.add.asObservable();
        this.addRoomType$ = this.addRoomType.asObservable();
        this.roomTypeList = [];
        this.licensedForBookIt = this.clientDetailPreserver.clientDetails.bookIt;
    }
    /**
     * This will create all the controls for the form group
     * @param roomFormGroup is the form group
     * @param fb is the form builder which will create the controls
     * @returns It will return the roomFromGroup with all the controls
     */
    public buildForm(): FormGroup {
        return this.fb.group({
            roomId: [],
            roomTypeId: ['', [Validators.required]],
            name: ['', [Validators.required, Validators.maxLength(30)]],
            location: ['', [Validators.required, Validators.maxLength(30)]],
            email: ['', [Validators.pattern(EMAIL_PATTERN), Validators.maxLength(50)]],
            roomLayouts: [],
        })
    };
    /** This will create all the controls for the form group */
    public buildRoomTypeForm(): FormGroup {
        return this.fb.group({
            roomTypeId: [],
            roomType: ['', [Validators.required, Validators.maxLength(30)]],
        })
    };

    /** build form-array for room-layouts */
    public buildRoomLayoutArray(data: RoomLayoutMaster[]): FormArray {
        const d = data.map(layout => this.buildRoomLayoutGroup(layout));
        return this.fb.array(d);
    }

    /**
     * This method will validate the form
     * If form is valid then it will 
     * @param roomFormGroup 
     */
    public saveRoom(roomFormGroup: FormGroup, roomLayoutFormArray: FormArray): void {
        if (roomLayoutFormArray.valid && roomFormGroup.valid) {
            let room: Room = roomFormGroup.getRawValue();
            const selectedLayouts: RoomLayoutMaster[] = (roomLayoutFormArray.getRawValue() as RoomLayoutMaster[]).filter(layout => layout.isChecked === true);
            room.roomLayouts = selectedLayouts.map((layout: RoomLayout) => new RoomLayout(layout));
            this.add.next(room);
        }
        else {
            // show any custom validation here 
        }
    }
    /**
     * saveRoomType
     * @param roomTypeFormGroup 
     */
    public saveRoomType(roomTypeFormGroup: FormGroup): void {
        if (roomTypeFormGroup.valid) {
            let room: RoomType = roomTypeFormGroup.getRawValue();
            this.addRoomType.next(room);
            this.closeTypeForm();
        }
        else {
            // show any custom validation here 
        }
    }

    /**
     * This will bind the form control value
     * @param userFormGroup is the form group containing all the controls
     * @param room is the object storing all the values  
     */
    public bindControlValue(roomFormGroup: FormGroup, room: Room): FormGroup {
        if (room) {
            roomFormGroup.patchValue(room);
        }
        return roomFormGroup;
    }

    /** create for add room type  */
    public addType(addTypeRef: ElementRef, templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef, ngSelect: NgSelectComponent): void {
        if (this.overlayRef && this.overlayRef.hostElement) {
            this.overlayRef.dispose();
            return;
        }
        const overlayConfig: OverlayConfig = new OverlayConfig();
        overlayConfig.hasBackdrop = true;
        overlayConfig.backdropClass = '';
        overlayConfig.positionStrategy = this.overlay.position().flexibleConnectedTo(addTypeRef).withPositions([{
            originX: 'end',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
        }]);
        // create overlay
        this.overlayRef = this.overlay.create(overlayConfig);
        // instance of conformation modal component
        const portal: TemplatePortal
            = new TemplatePortal(templateRef, viewContainerRef, { $implicit: ngSelect });
        // attach component portal 
        this.overlayRef.attach(portal);
        this.overlayRef.backdropClick().subscribe(() => {
            this.overlayRef.dispose();
        });
    }
    /** create for close type form */
    public closeTypeForm(): void {
        this.overlayRef && this.overlayRef.hostElement && this.overlayRef.dispose();
    }
    /** create for handel blur event of the status ng select */
    public onBlur(): boolean {
        return this.overlayRef && this.overlayRef.hostElement ? true : false;
    }
    /**
     * set room-layout enable/disable
     * @param roomTypeId room-type-id
     */
    public setRoomLayoutEnable(roomTypeId: number): void {
        const roomType: RoomType = this.findRoomTypeConference(roomTypeId);
        if (roomType) { this.enableRoomLayout = true; }
    }
    /** show/hide room-layout based on roomType selection */
    public showHideRoomLayout(roomFormGroup: FormGroup, roomLayoutFormArray: FormArray): void {
        const selectedRoomTypeId: number = (roomFormGroup.getRawValue() as Room).roomTypeId;
        const roomType: RoomType = this.findRoomTypeConference(selectedRoomTypeId);
        if (roomType) { this.enableRoomLayout = true; }
        else {
            this.enableRoomLayout = false;
            roomLayoutFormArray.controls.forEach((group: FormGroup) => {
                group.get('isChecked').setValue(false);
            })
        }
    }

    /**
     * get room-type detail based on ID if roomType is conference
     * @param id roomTypeId
     */
    private findRoomTypeConference(id: number): RoomType {
        return this.roomTypeList.find(type => type.roomTypeId === id && type.roomType.toLowerCase() === this.ROOM_TYPE_CONFERENCE);
    }

    /** build form-group for room-layout */
    private buildRoomLayoutGroup(layout: RoomLayoutMaster): FormGroup {
        return this.fb.group({
            isChecked: [false],
            noOfPerson: [null, [Validators.min(1), Validators.maxLength(10)]],
            roomLayoutId: [layout.roomLayoutId],
            roomLayout: [layout.roomLayout],
            roomLayoutImage: [layout.roomLayoutImage],
            roomLayoutImagePath: [layout.roomLayoutImagePath]
        });
    }
}



