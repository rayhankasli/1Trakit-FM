/** 
 * @author Nitesh Sharma
 */
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

/**
 * AppFileUploadComponent
 */
@Component({
  selector: 'lib-file-upload',
  templateUrl: './app-file-upload.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AppFileUploadComponent,
      multi: true
    }
  ],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class AppFileUploadComponent implements ControlValueAccessor {

  @Input() public disabled: boolean = false;
  /** if delete icon is required */
  @Input() public isDelete: boolean;
  /** file name */
  @Input() public fileName: string | string[];
  /** it is the label for file control */
  @Input() public fileLabel: string = 'Upload File';
  /** Multiple file upload */
  @Input() public multiple: boolean;
  /**
   * Determines whether change on
   */
  /** file path to preview */
  @Input() public set filePath(path: string) {
    this._filePath = path ? this.sanitize.bypassSecurityTrustUrl(path) : null;
  };
  public get filePath(): string {
    return this._filePath as string;
  }
  /** it is the thumbnail type of uploaded image */
  @Input() public thumbnailType: string;
  /** Generate random id for control */
  @Input() public id: string = 'customFile' + Math.ceil(Math.random() * 10);
  /** Accepted file types for control */
  @Input() public accept: string = 'image/png, image/jpeg';

  /** Determines whether change on */
  public onChange: Function;
  /** File  of app file upload component */
  public file: File | null;
  /** Store list of file */
  public fileList: File[];

  /** file path instance */
  private _filePath: SafeUrl;

  constructor(
    private host: ElementRef<HTMLInputElement>,
    private sanitize: DomSanitizer
  ) {
    this.file = null;
  }

  /**
   * Hosts listener
   * @param event 
   */
  @HostListener('change', ['$event']) public emitEvent(event: Event): void {
    if (event.target['value'] === '' || event.target['value'] === []) {
      return;
    }
    if (this.multiple) {
      this.fileList = [...event.target['files']];
      this.onChange(this.fileList);
      event.target['value'] = null;
    } else {
      const file: File = event.target['files'] && (event.target['files'] as FileList).item(0);
      this.onChange(file);
      this.file = file;
      // this.fileName = file.name;
      event.target['value'] = null;
    }
  }

  /**
   * Writes value
   * @param value 
   */
  public writeValue(value: any[]): void {
    // Set File array in fileList
    if (value) {
      this.fileList = value;
    }
    // clear file input
    this.host.nativeElement.value = '';
    this.file = null;
  }

  /**
   * Registers on change
   * @param fn 
   */
  public registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  /**
   * Registers on touched
   * @param fn 
   */
  public registerOnTouched(fn: Function): void {
  }

  /** Handles file delete action */
  public onDeleteFile(): void {
    this.onChange(null);
    this.file = null;
    if (this.fileName) {
      this.fileName = null;
    }
  }

  /** Remove file */
  public removeSelectedFile(index: number): void {
    // Remove file from file list array
    this.fileList.splice(index, 1);
    // file name string array convert in array
    let fileName: string[] = this.fileName as string[];
    // Remove file from file name string array
    fileName.splice(index, 1);
    this.onChange(this.fileList);
  }
}