import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
// ------------------------------------------------ //
import { Pictures } from '../../../../core/model/common.model';

@Component({
  selector: 'app-gallery-presentation',
  templateUrl: './gallery-presentation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryPresentationComponent {

  /** to show/hide image details */
  @Input() public enableDetail: boolean = false;
  /** to enable/disable print image */
  @Input() public enablePrint: boolean = true;
  /** This property is used to store the taskReports that has been retrieved from the API. */
  @Input() public set pictures(value: Pictures[]) {
    if (value) {
      this._pictures = value;
      this.pictureIndex = 0;
      this.picturePath = value[0].systemImageName.toString();
      if (this.enableDetail) { this.description = value[0].imageDesription; }
      this.isLoading = true;
    }
  }
  public get pictures(): Pictures[] {
    return this._pictures;
  }

  /** closeGallery */
  @Output() public closeGallery: EventEmitter<boolean>;

  /** to preserve picture index of the current image */
  public pictureIndex: number;
  /** to set picture path(src) for an <img/> */
  public picturePath: string;
  public description: string;
  /** to show/hide loader until the image get ready */
  public isLoading: boolean;
  /** list of pictures */
  private _pictures: Pictures[];

  constructor() {
    this.closeGallery = new EventEmitter();
  }

  /** previousImage */
  public previousImage(e): void {
    this.pictureIndex--;
    this.setPictureDetail(this.pictureIndex);
    e.target.blur();  // to ignore in firefox
  }
  /** nextImage */
  public nextImage(e): void {
    this.pictureIndex++;
    this.setPictureDetail(this.pictureIndex);
    e.target.blur();  // to ignore in firefox
  }

  /**
   * This method is invoke when user click dismiss button.
   */
  public dismiss(): void {
    this.closeGallery.emit(true);
  }

  /** to hide loader on success/erro */
  public hideLoader(): void {
    this.isLoading = false;
  }

  /**
   * set picture details based on passed picture-index
   * @param pictureIndex picture index, to load picture data
   */
  private setPictureDetail(pictureIndex: number): void {
    this.isLoading = true;
    if (this.enableDetail) { this.description = this.pictures[pictureIndex].imageDesription; }
    this.picturePath = this.pictures[pictureIndex].systemImageName.toString();
  }

}
