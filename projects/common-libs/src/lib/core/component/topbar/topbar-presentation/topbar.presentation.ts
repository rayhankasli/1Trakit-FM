/**
 * @author Mayur Patel.
 * @description This is topbar component to manage user profile,Change language and notification.  
 */
import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { User } from 'oidc-client';
// -------------------------------- //
import { ToggleAnimation, DropdownAnimation } from '../../dashboard.animation';
import { Language } from '../../../models/core.model';
import { TopbarService } from '../../../services/topbar/topbar.service';
import { LanguageDataService } from '../../../services/language/language-data.service';
import { TopbarPresenter } from '../topbar-presenter/topbar.presenter';

/**
 * TopbarPresentationComponent
 */
@Component({
  selector: 'lib-topbar-ui',
  templateUrl: './topbar.presentation.html',
  viewProviders: [TopbarPresenter],
  animations: [
    ToggleAnimation.bodyExpansion, 
    ToggleAnimation.indicatorRotate, 
    DropdownAnimation.fadeInDown
  ],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarPresentationComponent implements OnInit {
  /** Property to store all language data of type Language objects */
  @Input() public languageData: Language[];

  /** Property to store notification url */
  @Input() public notificationUrl: string;

  /** userData */
  @Input() public set fullName(fullName: string) {
    this._fullName = fullName;

  }
  public get fullName(): string {
    return this._fullName;
  }

  /**
   * Output  of topbar presentation component
   */
  @Output() public languageChange: EventEmitter<string>;
  /** Property to get the position and click of profile menu */
  @ViewChild('buttonRef', { static: false }) public elementRef: ElementRef;
  /** Property use to append class based on dropdown display type. */
  public userProfileState: boolean;
  /** Property use to manage dropdown state */
  public dropdownState: boolean;
  /** Language group form of topbar component */
  public languageGroupForm: FormGroup;
  /** User name of topbar component */
  public userName: string;

  /** Input  of topbar component */
  private _fullName: string;


  constructor(
    private languageService: LanguageDataService,
    private topbarService: TopbarService,
    private topbarPresenter: TopbarPresenter,
  ) {
    this.languageChange = new EventEmitter();
    this.dropdownState = false;
    this.userProfileState = false;
  }

  /**
   * on init
   */
  public ngOnInit(): void {
    this.languageGroupForm = this.topbarPresenter.buildForm();
    this.languageService.languageChange$.subscribe((res: string) => {
      if (!res) {
        res = 'en-us';
      }
      this.languageGroupForm.get('selectedLanguage').setValue(res);
    });
    this.topbarService.profileChange.subscribe((profileData: User['profile']) => {
      if (profileData != null) {
        this.userName = profileData.fullName;
      }
    });
   
  }

  /**
   * Users profile btn to open dropdown
   */
  public userProfileBtn(): void {
    this.dropdownState = false;
    this.userProfileState = !this.userProfileState;
  }

  /**
   * setting btn to open dropdown
   */
  public settingDropdownBtn(): void {
    this.userProfileState = false;
    this.dropdownState = !this.dropdownState;
  }

  /**
   * Renders notifications on notification click
   */
  public renderNotifications(): void {
    this.topbarPresenter.configureOverlay(this.elementRef, this.notificationUrl);
    this.userProfileState = false;
    this.dropdownState = !this.dropdownState;
  }



  /**
   * function called when user select language from dropdown
   */
  public languageChanged(): void {
    const selectedLang: string = this.languageGroupForm.get('selectedLanguage').value;
    this.languageChange.emit(selectedLang);
    this.languageService.updateLanguage(selectedLang);
  }

 

  /**
   * called when click on logout option
   */
  public logout(): void {
    this.topbarPresenter.logout();
  }

  /**
   * Tracks by
   * @param index 
   * @param item 
   * @returns by 
   */
  public trackBy(index: number, item: Language): number {
    return index;
  }


}
