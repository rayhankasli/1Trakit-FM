/**
 * @name SummaryAccordionPresenter
 * @author Enter Your Name Here
 * @description This is a presenter service for accordion which contains all logic for presentation component
 */

import { Injectable } from '@angular/core';
// ------------------------------------------- //
import { BaseAccordionPresenter } from '../../../../core/base-classes/accordion.presenter';
import { PaperType } from '../../../../shared/modules/copy-it-print-details/copyits.model';
import { copyItPageTypes } from '../../../models/copyit-constant';

/**
 * SummaryPresenter
 */
@Injectable()
export class SummaryPresenter extends BaseAccordionPresenter {

  constructor() {
    super();
    this._activeId = [];
    this.primaryColor = 'primary-color';
  }

  /**
   * it will find the page type value
   * @param pageType page type value for current request
   */
  public findPageType(pageType: number): string {
    const pageTypeObj: PaperType = copyItPageTypes.find((item: PaperType) => item.paperTypeId === pageType);
    if (pageTypeObj) {
      return pageTypeObj.paperType;
    }
    return '';
  }

  /**
   * it will find the page type value
   * @param pageType page type value for current request
   */
  public findPriceQuoteAndProof(priceQuoteOrProof: number): string {
    let priceQuoteOrProofValue: string;
    if (priceQuoteOrProof === 1) {
      priceQuoteOrProofValue = 'Yes';
    } else {
      priceQuoteOrProofValue = 'No';
    }
    return priceQuoteOrProofValue;
  }
}
