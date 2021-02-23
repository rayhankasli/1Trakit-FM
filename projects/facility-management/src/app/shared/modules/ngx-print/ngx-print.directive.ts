import { Directive, HostListener, Input } from '@angular/core';
@Directive({
  selector: "button[ngxPrint]"
})
export class NgxPrintDirective {

  /**
   *
   *
   * @memberof NgxPrintDirective
   */
  @Input() public printSectionId: string;

  /**
   *
   *
   * @memberof NgxPrintDirective
   */
  @Input() public printTitle: string;

  /**
   *
   *
   * @memberof NgxPrintDirective
   */
  @Input() public useExistingCss = false;

  /**
   * A delay in milliseconds to force the print dialog to wait before opened. Default: 0
   *
   * @memberof NgxPrintDirective
   */
  @Input() public printDelay: number = 0;

  /**
   *
   *
   * @memberof NgxPrintDirective
   */
  @Input() public set printStyle(values: { [key: string]: { [key: string]: string } }) {
    for (let key in values) {
      if (values.hasOwnProperty(key)) {
        this._printStyle.push((key + JSON.stringify(values[key])).replace(/['"]+/g, ''));
      }
    }
    this.returnStyleValues();
  }

  /**
   * @memberof NgxPrintDirective
   * @param cssList
   */
  @Input() public set styleSheetFile(cssList: string) {
    let linkTagFn = function (cssFileName) {
      return `<link rel="stylesheet" type="text/css" href="${cssFileName}">`;
    }
    if (cssList.indexOf(',') !== -1) {
      const valueArr = cssList.split(',');
      for (let val of valueArr) {
        this._styleSheetFile = this._styleSheetFile + linkTagFn(val);
      }
    } else {
      this._styleSheetFile = linkTagFn(cssList);
    }
  }

  /** Print Style */
  public _printStyle = [];

  /**
   *
   *
   * @returns html for the given tag
   *
   * @memberof NgxPrintDirective
   */
  private _styleSheetFile = '';


  /**
   *
   * Listen to click event
   * @memberof NgxPrintDirective
   */
  @HostListener('click') public print(): void {
    let printContents: string, popupWin: Window, styles: string = '', links: string = '';

    if (this.useExistingCss) {
      styles = this.getElementTag('style');
      links = this.getElementTag('link');
    }

    printContents = this.getHtmlContents();
    // popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin = window.open('');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>${this.printTitle ? this.printTitle : ''}</title>
          ${this.returnStyleValues()}
          ${this.returnStyleSheetLinkTags()}
          ${styles}
          ${links}
        </head>
        <body>
          ${printContents}
          <script defer>
            function triggerPrint(event) {
              window.removeEventListener('load', triggerPrint, false);
              setTimeout(function() {
                window.print();
                setTimeout(function() { window.close(); }, 0);
              }, ${this.printDelay});
            }
            window.addEventListener('load', triggerPrint, false);
          </script>
        </body>
      </html>`);
    popupWin.document.close();
  }

  /**
   * Return style values
   * @returns the string that create the stylesheet which will be injected
   * later within <style></style> tag.
   *
   * -join/replace to transform an array objects to css-styled string
   *
   * @memberof NgxPrintDirective
   */
  public returnStyleValues(): string {
    return `<style> ${this._printStyle.join(' ').replace(/,/g, ';')} </style>`;
  }

  /**
   * Get stylesheet link tag
   * @returns string which contains the link tags containing the css which will
   * be injected later within <head></head> tag.
   */
  private returnStyleSheetLinkTags(): string {
    return this._styleSheetFile;
  }
  /** Get element tag */
  private getElementTag(tag: keyof HTMLElementTagNameMap): string {
    const html: string[] = [];
    const elements: any = document.getElementsByTagName(tag);
    // tslint:disable-next-line: triple-equals
    if (tag == 'link') {
      // tslint:disable-next-line: prefer-for-of
      for (let index: number = 0; index < elements.length; index++) {
        if (elements[index].rel == 'stylesheet') {
          html.push('<link rel="stylesheet" href="' + elements[index].href + '">');
        }
      }
    } else {
      // tslint:disable-next-line: prefer-for-of
      for (let index: number = 0; index < elements.length; index++) {
        html.push(elements[index].outerHTML);
      }
    }
    return html.join('\r\n');
  }

  /**
   * Get HTML Content
   * @returns html section to be printed along with some associated inputs
   */
  private getHtmlContents(): string {
    let printContents = document.getElementById(this.printSectionId);
    let innards = printContents.getElementsByTagName('input');

    for (var i = 0; i < innards.length; i++) {
      innards[i].defaultValue = innards[i].value;
    }
    return printContents.innerHTML;
  }
}