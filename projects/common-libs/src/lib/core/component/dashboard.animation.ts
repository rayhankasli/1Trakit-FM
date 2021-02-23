/** 
 * @author Binal Lad 
 */

import { AnimationTriggerMetadata, trigger, state, style, transition, animate } from '@angular/animations';

export const ToggleAnimation: {
  /** indicatorRotate */
  readonly indicatorRotate: AnimationTriggerMetadata;
  /** bodyExpansion */
  readonly bodyExpansion: AnimationTriggerMetadata;
} = {
  /** Animation  that rotates the indicator arrow. */
  indicatorRotate: trigger('indicatorRotate', [
    state('collapsed, void', style({
      transform: 'rotate(0deg)'
    })),
    state('expanded', style({
      transform: 'rotate(90deg)'
    })),
    transition('collapsed <=> expanded, void => collapsed', [animate('0.4s')])
  ]),

  /** Animation that expand body content. */
  bodyExpansion: trigger('bodyExpansion', [
    state('collapsed, void', style({
      height: '0px',
      visibility: 'hidden'
    })),
    state('expanded', style({
      height: '*',
      visibility: 'visible'
    })),
    transition('collapsed <=> expanded, void => collapsed', [animate('0.4s')])
  ])
}

export const DropdownAnimation: {
  /** fadeInDown */
  readonly fadeInDown: AnimationTriggerMetadata;
} = {
  // Animation for dropdown menu
  fadeInDown: trigger('fadeInDown', [
    state('closed, void', style({
      transform: 'translateY(-15px)',
      visibility: 'hidden',
      opacity: 0
    })),
    state('open', style({
      transform: 'translateY(0)',
      visibility: 'visible',
      opacity: 1
    })),
    transition('closed <=> open, void => closed', [animate('300ms')])
  ])
}

export const SlideAnimation: {
  /** slideInOut  */
  readonly slideInOut: AnimationTriggerMetadata;
} = {
  // Animation for slide in and out
  slideInOut: trigger('slideInOut', [
    state('collapsed, void', style({
      transform: 'translateX(100%)',
      visibility: 'hidden'
    })),
    state('expand', style({
      transform: 'translateX(0)',
      visibility: 'visible'
    })),
    transition('collapsed <=> expand, void => collapsed', [animate('0.4s')])
  ])
}

