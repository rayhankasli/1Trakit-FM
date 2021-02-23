

/**
 * @name ClientContainerComponent
 * @author Enter Your Name Here
 * @description This is a container component for Client. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component, HostBinding } from '@angular/core';
//--------------------------------------------------------------------//

/**
 * ClientContainerComponent
 */
@Component({
  selector: 'app-client-container',
  templateUrl: './client.container.html'
})
export class ClientContainerComponent {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex h-100 overflow-hidden';
  
  constructor(
  ) { }

}
