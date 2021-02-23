import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// -------------------------------------------------------- //
import { CoreDataService } from '../../../../core/services/core-data.service';
import { CustomChatBoxPresenter } from '../custom-chat-box-presenter/custom-chat-box-presenter';
import { Conversation } from '../models/custom-chat-box.model';

@Component({
  selector: 'app-custom-chat-box',
  templateUrl: './custom-chat-box.presentation.html',
  viewProviders: [CustomChatBoxPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomChatBoxPresentationComponent implements OnInit, OnDestroy {

  /** Set moduleId for message form */
  @Input() public set moduleId(moduleId: number) {
    if (moduleId) {
      this.messageForm.patchValue({ moduleId });
      this.cd.detectChanges();
    }
  }
  /** Set userId for message form */
  @Input() public set userId(userId: number) {
    if (userId) {
      this.messageForm.patchValue({ userId });
      this.cd.detectChanges();
    }
  }

  @Input() public set isEnable(flag: boolean) {
    this.messageForm.enable();
    if (!flag) {
      this.messageForm.disable();
    }
    this._isEnable = flag || false;
    this.cd.detectChanges();
  }

  public get isEnable(): boolean {
    return this._isEnable;
  }

  @Input() public set conversation(chat: Conversation[]) {
    if (chat) {
      this._conversation = chat;
      this.cd.detectChanges();
    }
  }

  public get conversation(): Conversation[] {
    return this._conversation;
  }

  /** Event emitter refreshE */
  @Output() public refreshE: EventEmitter<boolean>;
  /** Event emitter sendE */
  @Output() public sendE: EventEmitter<Conversation>;

  /** Message form */
  public messageForm: FormGroup;
  /** Date format Constant */
  public dateFormat: string = 'EEE, MMMM dd y ';
  /** Time format Constant */
  public timeFormat: string = 'hh:mm a';

  /** get active userId */
  public get activeUserId(): number {
    return this.coreService.userInfo.userId;
  }
  /** form submitted state */
  public get isFormSubmitted(): boolean {
    return this.chatBoxPresenter.isFormSubmitted;
  }

  /** Conversation list */
  private _conversation: Conversation[];
  /** wether isEnable or not */
  private _isEnable: boolean;
  /** Observable for unsubscribe */
  private destroy: Subject<boolean>;

  constructor(
    private chatBoxPresenter: CustomChatBoxPresenter,
    private cd: ChangeDetectorRef,
    private sanitize: DomSanitizer,
    private coreService: CoreDataService
  ) {
    this.destroy = new Subject();
    this.refreshE = new EventEmitter(true);
    this.sendE = new EventEmitter(true);
    this.messageForm = this.chatBoxPresenter.getMessageControl();
  }

  public ngOnInit(): void {
    this.refreshChat();
    this.chatBoxPresenter.send$.pipe(takeUntil(this.destroy))
      .subscribe((message: Conversation) => {
        this.sendE.emit(message);
        this.resetChatForm();
      });
  }

  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }

  /** sanitize user image */
  public sanitizedAvatar(path: string): SafeUrl {
    return this.sanitize.bypassSecurityTrustUrl(path);
  }

  /** Refresh chat */
  public refreshChat(): void {
    this.refreshE.emit(true);
  }

  /** Send message */
  public sendMessage(): void {
    this.chatBoxPresenter.sendMessage(this.messageForm);
  }

  /** to optimize DOM */
  public trackBy(key:string,index:number,data:any):number{
    return data[key];
  }

  /** Reset chat form */
  private resetChatForm(defaultMessage: string = null): void {
    this.messageForm.get('message').reset(defaultMessage)
  }
}
