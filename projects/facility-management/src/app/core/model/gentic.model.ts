import { Observable } from 'rxjs';
import { SiteBase, Language, Menu, HelpContent } from 'common-libs';
import { SafeResourceUrl } from '@angular/platform-browser';

export class Site extends SiteBase{
         constructor(
            name: string,
            logo: string,
            language: Observable<Language[]>,
            menus: Observable<Menu[]>,
            helpcontents: Observable<HelpContent[]>,
        ) {
            super(name, logo, language, menus, helpcontents);
        }      
}

export class Card {

    public index: number;
    /** Holds Type of card */
    public type: boolean;

    /** Holds Icon of card */
    public icon: string;

    /** Holds Title of card */
    public title: string;

    /** Holds Link of card */
    public link: SafeResourceUrl;

    /** Holds Description of card */
    public description: string;

    /** Holds Height of card */
    public height: string;

    /** Holds Width of card */
    public gridsize: string;

    constructor(
        index: number,
        type: boolean,
        icon: string,
        title: string,
        link: SafeResourceUrl,
        description: string,
        height: string,
        gridsize: string,
    ) {
        this.index = index
        this.type = type;
        this.icon = icon;
        this.title = title;
        this.link = link;
        this.description = description;
        this.height = height;
        this.gridsize = gridsize;
    }
}

export class FunctionalLink {

    /** Index  of functional link */
    public index: number;

    /*** Label  of functional link */
    public label: string;

    /** Link  of functional link */
    public link: string;

    constructor(
        index: number,
        label: string,
        link: string
    ) {
        this.index = index;
        this.label = label;
        this.link = link;
    }
}
export class GuideLine {

    /** Title  of guide line */
    public title: string;

    /** Description  of guide line */
    public description: string;

    /** Term text of guide line */
    public termText: string;

    /** Determines whether allowed term condition is */
    public isAllowedTermCondition: boolean;

    constructor(
       
        title: string,
        description: string,
        termText: string,
        isAllowedTermCondition:boolean
    ) {
       
        this.title = title;
        this.description = description;
        this.termText = termText;
        this.isAllowedTermCondition =isAllowedTermCondition;
    }
}
