import { Injectable } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
// ------------------------------------------------ //
import { CopyItPickAsset, CopyItAsset } from '../../../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-asset';
import { CopyItInfo } from '../../../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-info';
import { CopyItDetailPaperSizes } from '../../../../../shared/modules/copy-it-print-details/models/copyit-info';
import { getUniqueByProp } from '../../../../../core/utility/utility';
import { CopyitCommonService } from 'projects/facility-management/src/app/shared/modules/copy-it-print-details/copyit-common.service';


@Injectable()
export class PickAssetsPresenter {

  public saveChanges$: Observable<CopyItInfo>;
  /** Form submitted flag */
  public isFormSubmitted: boolean;
  private saveChanges: Subject<CopyItInfo>;

  constructor(
    private fb: FormBuilder,
    private copyitCommonService: CopyitCommonService
  ) {
    this.saveChanges = new Subject();
    this.saveChanges$ = this.saveChanges.asObservable();
  }

  /** get Asset list drop-down control */
  public getAssetListControl(): FormControl {
    return this.fb.control([], []);
  }

  /** get copyIt assets form array */
  public getCopyItFormGroup(copyItAssets: CopyItPickAsset[], isDisabled: boolean = false): FormGroup {
    return this.fb.group({
      pickAssets: this.fb.array(this.getAssetsFormGroupList(copyItAssets, isDisabled))
    })
  }

  /** Validate copyIt form controls and return patched value  */
  public validateForm(form: FormGroup, copyItInfo: CopyItInfo, activeAssetId: number[]): void {
    this.setRuntimeValidations(form);
    if (!form.invalid) {
      const newCopyItInfo: CopyItInfo = new CopyItInfo();
      newCopyItInfo.pickAssets = this.getCopyItAssetReads((form.get('pickAssets') as FormArray).getRawValue(), copyItInfo.pickAssets, activeAssetId);
      newCopyItInfo.assets = this.getSelectedCopyItAssets(copyItInfo, activeAssetId);
      this.saveChanges.next(newCopyItInfo);
    } else {
      this.isFormSubmitted = true;
    }
  }

  /** Get single asset form group */
  public getAssetFormGroup(asset: CopyItPickAsset, isDisabled: boolean = false): FormGroup {
    const group = this.fb.group({
      copyItAssetId: [null],
      copyItAssetMeterId: [null],
      assetId: [asset.assetId],
      manufacturer: [asset.manufacturer],
      assetNo: [asset.assetNo],
      modelNo: [asset.modelNo],
      assetMeterId: [null],

      previousColorRead: [asset.previousColorRead || null, [Validators.min(asset.previousColorRead)]],
      currentColorRead: [asset.currentColorRead || null, [Validators.min(asset.previousColorRead)]],

      previousBWRead: [asset.previousBWRead || null, [Validators.min(asset.previousBWRead)]],
      currentBWRead: [asset.currentBWRead || null, [Validators.min(asset.previousBWRead)]],

      previousScanRead: [asset.previousScanRead || null, [Validators.min(asset.previousScanRead)]],
      currentScanRead: [asset.currentScanRead || null, [Validators.min(asset.previousScanRead)]],

      colorRate: [{ value: asset.colorRate, disabled: true }],
      colorTenantRate: [{ value: asset.colorTenantRate, disabled: true }],
      bWRate: [{ value: asset.bWRate, disabled: true }],
      bWTenantRate: [{ value: asset.bWTenantRate, disabled: true }],
      scanRate: [{ value: asset.scanRate, disabled: true }],
      scanTenantRate: [{ value: asset.scanTenantRate, disabled: true }],

      colorClientConfigureDefaultId: [asset.colorClientConfigureDefaultId || null],
      bWClientConfigureDefaultId: [asset.bWClientConfigureDefaultId || null],
    });
    if (isDisabled) {
      group.disable();
    }
    return group;
  }
  /** Remove unchecked assets */
  public removeAssets(formArray: FormArray, selectedAssets: number[], currentAssets: number[]): void {
    const removedAssets: number[] = selectedAssets.filter(a => !currentAssets.includes(a));
    const idxRemoving: number[] = formArray.getRawValue()
      .map((a, i) => removedAssets.includes(a.assetId) ? i : null)
      .filter(a => a !== null);
    idxRemoving.forEach(x => formArray.removeAt(x));
  }

  /** Add checked assets */
  public addCheckedAssets(formArray: FormArray, selectedAssets: number[], currentAssets: number[], assetList: CopyItPickAsset[], isDisabled: boolean = false): void {
    const newAssets: number[] = currentAssets.filter(a => !selectedAssets.includes(a));
    assetList.filter(x => newAssets.includes(x.assetId))
      .forEach(asset => formArray.insert(0, this.getAssetFormGroup(asset, this.getAssetDisableStatus(isDisabled, asset.isActive))));
  }

  /**
   * get asset active/inactive status
   * @param forceDisable manual disable
   * @param isActive asset active/inactive state
   */
  public getAssetDisableStatus(forceDisable: boolean, isActive: boolean): boolean {
    // to check if asset is force disabled(isDisabled) or inactivated(!isActive)
    return forceDisable || !isActive;
  }

  /** Get filtered black and white and color paper size */
  public blackAndWhiteColoredPaperSizes(copyItInfo: CopyItInfo, paperType: any): CopyItDetailPaperSizes[] {
    const list: CopyItDetailPaperSizes[] = copyItInfo ? [copyItInfo.frontCoverPageSize, copyItInfo.middlePageSize]
      .filter((d: CopyItDetailPaperSizes) => d && (!d.paperColorTypeId || d.paperColorTypeId === paperType))
      .map(d => { d.paperSizeOptionDetail = this.copyitCommonService.paperSizeOption(d); return d; }) : [];
    return [...getUniqueByProp(list, 'clientConfigureDefaultId')];
  }

  /** copyIt Historical Asset */
  public copyItHistoricalAsset(copyItPickAssets: CopyItPickAsset[], assetId: number): CopyItPickAsset[] {
    return copyItPickAssets.filter((asset: CopyItPickAsset) => asset.assetId === assetId && (asset.colorClientConfigureDefaultId || asset.bWClientConfigureDefaultId)) || null;
  }

  /** Get assets form group list */
  private getAssetsFormGroupList(assets: CopyItPickAsset[] = [], isDisabled: boolean = false): FormGroup[] {
    return assets.map((asset: CopyItPickAsset) => this.getAssetFormGroup(asset)) || [];
  }

  /** get selected copyit assets */
  private getSelectedCopyItAssets(copyItInfo: CopyItInfo, activeAssetId): CopyItAsset[] {
    const selectedAssets: CopyItAsset[] = [];
    activeAssetId.forEach(assetId => {
      let findAsset = copyItInfo.assets.find(asset => asset.assetId === assetId);
      if (!findAsset) { findAsset = new CopyItAsset({ assetId }) };
      selectedAssets.push(findAsset);
    });
    return selectedAssets;
  }
  /** get copyit asset meter reads */
  private getCopyItAssetReads(newAssets: CopyItPickAsset[], historical: CopyItPickAsset[], activeAssetId: number[]): CopyItPickAsset[] {
    // remove unchecked assets
    let currentList: CopyItPickAsset[] = historical;
    currentList = historical.filter(asset => activeAssetId.includes(asset.assetId));

    this.isFormSubmitted = false;
    const assets: CopyItPickAsset[] = newAssets;
    assets
      // check any current read exist
      .filter((asset: CopyItPickAsset) => asset.currentColorRead || asset.currentBWRead || asset.currentScanRead)
      .forEach((asset: CopyItPickAsset) => {
        // set current read = previous read 
        if (!asset.currentColorRead) { asset.currentColorRead = asset.previousColorRead; }
        if (!asset.currentBWRead) { asset.currentBWRead = asset.previousBWRead; }
        if (!asset.currentScanRead) { asset.currentScanRead = asset.previousScanRead; }
        // set previous read = 0 if not exist
        if (asset.currentColorRead && !asset.previousColorRead) { asset.previousColorRead = 0 }
        if (asset.currentBWRead && !asset.previousBWRead) { asset.previousBWRead = 0 }
        if (asset.currentScanRead && !asset.previousScanRead) { asset.previousScanRead = 0 }
        // push new read to historical reads
        currentList.push(asset);
      });
    return currentList;
  }

  /** update current reading validators based on previous value selection */
  private setRuntimeValidations(form: FormGroup): void {
    const pickAssetFormArray = form.get('pickAssets') as FormArray;
    pickAssetFormArray.controls.forEach((group: FormGroup) => {
      const read: CopyItPickAsset = group.getRawValue();
      group.get('currentColorRead').setValidators([Validators.min(read.previousColorRead)]);
      group.get('currentBWRead').setValidators([Validators.min(read.previousBWRead)]);
      group.get('currentScanRead').setValidators([Validators.min(read.previousScanRead)]);
      group.get('currentColorRead').updateValueAndValidity();
      group.get('currentBWRead').updateValueAndValidity();
      group.get('currentScanRead').updateValueAndValidity();
    })
  }
}
