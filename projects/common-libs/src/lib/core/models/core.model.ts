/**
 * @author Hem Chudgar
 */

import { Observable } from 'rxjs/Observable';

/**
 * Params
 */
export class Params<T= any> {
    /**
     * Page  of params
     */
    public page: string;
    /**
     * Per page of params
     */
    public perPage: string;
    /**
     * Sort  of params
     */
    public sort: string;
    /**
     * Order  of params
     */
    public order: string;
    /**
     * Start  of params
     */
    public start: string;
    /**
     * End  of params
     */
    public end: string;
    /**
     * Q  of params
     */
    public q: string;
    /**
     * Filter  of params
     */
    public filter: T;
}



/**
 * Site base
 */
export class SiteBase {


    /** Holds name of current site */
    public name: string;

    /** Holds logo image path of current site. */
    public logo: string;

    /** Holds language of current site. */
    public language: Observable<Language[]>;

    /** Holds menus of current site. */
    public menus: Observable<Menu[]>;

    /** Holds help contents of current site. */
    public helpcontents: Observable<HelpContent[]>;

    constructor(
        name: string,
        logo: string,
        language: Observable<Language[]>,
        menus: Observable<Menu[]>,
        helpcontents: Observable<HelpContent[]>,
    ) {
        this.name = name;
        this.logo = logo;
        this.language = language;
        this.menus = menus;
        this.helpcontents = helpcontents;
    }
}
/**
 * Language
 */
export class Language {

    /**
     * Index  of language
     */
    public index: number;
    /** Holds value of language */
    public name: string;

    /** Holds Code of language */
    public code: string;

    constructor(
        index: number,
        name: string,
        code: string,
    ) {
        this.index = index;
        this.name = name;
        this.code = code;
    }
}

/**
 * Menu
 */
export class Menu {

    /**
     * Index  of menu
     */
    public index: number;

    /**
     * Name  of menu
     */
    public name: string;

    /**
     * Link  of menu
     */
    public link: string;

    /**
     * Icon  of menu
     */
    public icon: string;

    /**
     * Parent menu id of menu
     */
    public parentMenuId: string;

    /**
     * Permisison  of menu
     */
    public permisison: boolean;

    /**
     * Determines whether route link is
     */
    public isRouteLink: boolean;

    /**
     * Determines whether open is
     */
    public isOpen: boolean;

    /**
     * Sub menus of menu
     */
    public subMenus: SubMenu[];

    constructor(
        index: number,
        name: string,
        link: string,
        icon: string,
        isOpen: boolean,
        permisison: boolean,
        isRouteLink: boolean,
        subMenu?: SubMenu[],

    ) {
        this.index = index;
        this.name = name;
        this.link = link;
        this.icon = icon;
        this.isOpen = isOpen;
        this.permisison = permisison;
        this.isRouteLink = isRouteLink;
        this.subMenus = subMenu || [];

    }
}

/**
 * Sub menu
 */
export class SubMenu {

    /**
     * Index  of sub menu
     */
    public index: number;

    /**
     * Name  of sub menu
     */
    public name: string;

    /**
     * Link  of sub menu
     */
    public link: string;

    /**
     * Icon  of sub menu
     */
    public icon: string;

    constructor(
        index: number,
        name: string,
        link: string,
        icon: string) {
        this.index = index;
        this.name = name;
        this.link = link;
        this.icon = icon;
    }

}

/**
 * Help content
 */
export class HelpContent {
    /**
     * Index  of help content
     */
    public index: number;
    /**
     * Question  of help content
     */
    public question: string;

    /**
     * Answer  of help content
     */
    public answer: string;

    constructor(
        index: number,
        question: string,
        answer: string
    ) {
        this.index = index;
        this.question = question;
        this.answer = answer;
    }
}

/**
 * Break point enum
 */
export enum BreakPointEnum {
    IsMobile = 'mobile',
    IsDesktop = 'desktop'
}

/**
 * Modal size
 */
export enum ModalSize {
    Small = 'small',
    Medium = 'medium',
    Large = 'large'
  } 
