import {
  AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Inject,
  Input, NgZone, OnDestroy, OnInit, Output
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { AuthPolicyService } from 'auth-policy';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
// ------------------------------------------------------------- //
import { CopyIt } from '../../../../../core/enums/role-permissions.enum';
import { CopyItPaperColorType } from '../../../../../shared/modules/copy-it-print-details/models/copy-it.enum';
import { CopyItDetailPaperSizes } from '../../../../../shared/modules/copy-it-print-details/models/copyit-info';
import { CopyItAsset, CopyItPickAsset } from '../../../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-asset';
import { CopyItInfo } from '../../../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-info';
import { BaseCopyitStepperPresentation } from '../../../../copyit-stepper-container/copyit-stepper-presentation/base-copyit-stepper-presentation/base-copyit-stepper.presentation';
import { RateRequestType } from '../../../../models/copy-it.enum';
import { PickAssetsPresenter } from '../pick-assets-presenter/pick-assets.presenter';

/**
 * Component for copyit pick asset
 */
@Component({
  selector: 'app-pick-assets-ui',
  exportAs: 'pickAssets',
  templateUrl: './pick-assets.presentation.html',
  viewProviders: [PickAssetsPresenter],
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PickAssetsPresentationComponent extends BaseCopyitStepperPresentation implements OnInit, AfterViewInit, OnDestroy {

  /** for selected assets of a copyit request */
  @Input() public set copyItSelectedAssets(selectedAssets: CopyItAsset[]) {
    if (selectedAssets) {
      this._copyItSelectedAssets = selectedAssets;
      const selected: number[] = [...new Set(selectedAssets.map((x: CopyItPickAsset) => x.assetId))];
      this.assetListControl.patchValue(selected, { emitEvent: true });
      this.selectedAssetId = selected;
    }
  }
  public get copyItSelectedAssets(): CopyItAsset[] {
    return this._copyItSelectedAssets;
  }

  /** for picked asset entries */
  @Input() public set copyItPickAssets(assets: CopyItPickAsset[]) {
    if (assets) {
      this._copyItPickAssets = [...assets];
    }
  }
  public get copyItPickAssets(): CopyItPickAsset[] {
    return this._copyItPickAssets;
  }

  /** This will set the data */
  @Input() public set copyItInfo(value: CopyItInfo) {
    if (value) {
      this._copyItInfo = { ...value };
      this.bWPaperSizeList = this.pickAssetsPresenter.blackAndWhiteColoredPaperSizes(this.copyItInfo, CopyItPaperColorType.BW);
      this.colorPaperSizeList = this.pickAssetsPresenter.blackAndWhiteColoredPaperSizes(this.copyItInfo, CopyItPaperColorType.COLOR);
      this.isRateTypeTenant = value.rateRequestTypeId === RateRequestType.TENANT ? true : false;
    }
  }
  public get copyItInfo(): CopyItInfo {
    return this._copyItInfo;
  }

  /** This will set the data for assets list */
  @Input() public set assetList(value: CopyItPickAsset[]) {
    if (value) {
      this._assets = [...value];
      this.setInitialAssets();
    }
  }
  public get assetList(): CopyItPickAsset[] {
    return this._assets;
  }

  /** Emit the updated copyIt Assets details Info */
  @Output() public updateCopyItAssets: EventEmitter<CopyItInfo>;
  /** Emit current form array values for immediate calculations */
  @Output() public currentAssetDetail: EventEmitter<CopyItPickAsset[]>;

  /** get form array for copyIt form assets */
  public get copyItAssetFormArray(): FormArray {
    return this.copyItAssetsForm.get('pickAssets') as FormArray;
  }
  /** to access disabled controls */
  public get readOnlyAssetArray(): CopyItPickAsset[] {
    return this.copyItAssetFormArray.getRawValue();
  }
  /** Form submitted state */
  public get isFormSubmitted(): boolean {
    return this.pickAssetsPresenter.isFormSubmitted;
  }
  /** selected asset list used for badges */
  public get selectedAssetList(): CopyItPickAsset[] {
    return this.assetList.filter((asset: CopyItPickAsset) => this.selectedAssetId.includes(asset.assetId))
  }

  /** Check wether form is disable or not */
  public isDisabled: boolean;
  /** Store CopyIt Assets Form */
  public copyItAssetsForm: FormGroup;
  /** Store the asset list form control */
  public assetListControl: FormControl;
  /** Store Color paper size list */
  public colorPaperSizeList: CopyItDetailPaperSizes[];
  /** Store Black and White paper size list */
  public bWPaperSizeList: CopyItDetailPaperSizes[];
  /** Check isRateTypeTenant or Not */
  public isRateTypeTenant: boolean;


  /** Store copyIt details info */
  private _copyItInfo: CopyItInfo;
  /** Store assets */
  private _assets: CopyItPickAsset[];
  /** Store copyIt pick assets list  */
  private _copyItPickAssets: CopyItPickAsset[];
  /** Store copyIt selected assets list */
  private _copyItSelectedAssets: CopyItAsset[];
  /** Store Selected asset id list */
  private selectedAssetId: number[];

  constructor(
    private pickAssetsPresenter: PickAssetsPresenter,
    private policyService: AuthPolicyService,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.initProp();
  }

  public ngOnInit(): void {
    this.copyItAssetsForm.get('pickAssets').valueChanges.pipe(takeUntil(this.destroy), debounceTime(300))
      .subscribe((pickAssets: CopyItPickAsset[]) => {
        // in case only valid data to be passed
        // if (this.copyItAssetsForm.get('pickAssets').valid)
        this.currentAssetDetail.emit(pickAssets);
      });
    this.baseNextStep$.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.saveCopyItAssets();
    });

    this.pickAssetsPresenter.saveChanges$.pipe(takeUntil(this.destroy)).subscribe((copyItInfo: CopyItInfo) => {
      this.updateCopyItAssets.emit(copyItInfo);
    });

    /** disable pick assets based on role */
    this.setPickAssetDisable();
  }

  public ngAfterViewInit(): void {
    /** On Asset list change, add/remove table forms */
    this.assetListControl.valueChanges.pipe(takeUntil(this.destroy)).subscribe((assets: number[]) => {
      // remove unchecked assets
      this.pickAssetsPresenter.removeAssets(this.copyItAssetFormArray, this.selectedAssetId, assets);
      // add new assets
      this.pickAssetsPresenter.addCheckedAssets(this.copyItAssetFormArray, this.selectedAssetId, assets, this.assetList, this.isDisabled);
      // set selected asset ids
      this.selectedAssetId = [...assets];
    });
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** get copyit historical asset */
  public copyItHistoricalAsset(assetId: number): CopyItPickAsset[] {
    return this.pickAssetsPresenter.copyItHistoricalAsset(this.copyItPickAssets, assetId);
  }

  /** remove selected asset */
  public removeAsset(item: CopyItPickAsset): void {
    const selected: number[] = [...this.selectedAssetId];
    selected.splice(selected.indexOf(item.assetId), 1)
    this.assetListControl.patchValue(selected);
  }

  /** custom search fn for assets */
  public customSearchFn(term: string, item: CopyItPickAsset): boolean {
    term = term.toLowerCase();
    return item.manufacturer.toLowerCase().indexOf(term) > -1 || item.assetNo.toLowerCase().indexOf(term) > -1 || item.modelNo.toLowerCase().indexOf(term) > -1;
  }

  /** Validate pick assets */
  private saveCopyItAssets(): void {
    this.pickAssetsPresenter.validateForm(this.copyItAssetsForm, this.copyItInfo, [...this.selectedAssetId])
  }

  /** set initial assets */
  private setInitialAssets(): void {
    const selectedAssets: CopyItPickAsset[] = this.assetList
      .filter((asset: CopyItPickAsset) => this.selectedAssetId.includes(asset.assetId))
    if (selectedAssets) {
      selectedAssets.forEach((asset: CopyItPickAsset) => {
        // to check if asset is disabled(isDisabled)
        const disableStatus: boolean = this.pickAssetsPresenter.getAssetDisableStatus(this.isDisabled, asset.isActive);
        this.copyItAssetFormArray.push(this.pickAssetsPresenter.getAssetFormGroup(asset, disableStatus));
      })
    }
  }

  /** set pick asset disable */
  private setPickAssetDisable(): void {
    this.isDisabled = !this.policyService.hasPermission(CopyIt.pickAsset);
    if (this.isDisabled) {
      this.assetListControl.disable();
      this.copyItAssetFormArray.disable();
    }
  }

  /** Init Prop */
  private initProp(): void {
    this._assets = [];
    this.copyItAssetsForm = this.pickAssetsPresenter.getCopyItFormGroup([]);
    this.assetListControl = this.pickAssetsPresenter.getAssetListControl();
    this.updateCopyItAssets = new EventEmitter<CopyItInfo>(true);
    this.currentAssetDetail = new EventEmitter<CopyItPickAsset[]>(true);
    this.destroy = new Subject();
  }
}
