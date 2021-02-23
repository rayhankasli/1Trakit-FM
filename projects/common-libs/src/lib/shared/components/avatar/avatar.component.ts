import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'avatar',
  exportAs: 'avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {

  @Input() public set name(name: string) {
    this._name = name;
  }
  public get name(): string {
    return this._name
  }
  private _name: string;

  constructor() { }
  public ngOnInit(): void { }

}
