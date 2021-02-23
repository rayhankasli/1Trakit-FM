import { Injectable } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
// ------------------------------------------- //
import { Conversation } from '../models/custom-chat-box.model';

@Injectable()
export class CustomChatBoxPresenter {

  /** form state flag */
  public isFormSubmitted: boolean;
  /** Send event observable */
  public send$: Observable<Conversation>;

  /** Send event subject */
  private send: Subject<Conversation>;

  constructor(
    private fb: FormBuilder,
  ) {
    this.send = new Subject<Conversation>();
    this.send$ = this.send.asObservable();
    this.isFormSubmitted = false;
  }

  /** get message control */
  public getMessageControl(): FormGroup {
    return this.fb.group({
      moduleId: ['', []],
      userId: ['', []],
      message: [null, [Validators.required, Validators.maxLength(255)]],
    });
  }

  /** Send message */
  public sendMessage(form: FormGroup): void {
    if (form.valid) {
      this.send.next(form.getRawValue());
      this.isFormSubmitted = false;
    } else {
      this.isFormSubmitted = true;
    }
  }
}
