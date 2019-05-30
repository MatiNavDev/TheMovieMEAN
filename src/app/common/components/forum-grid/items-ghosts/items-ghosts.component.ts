import { Component, Input } from '@angular/core';

@Component({
  selector: 'items-ghosts',
  templateUrl: './items-ghosts.component.html',
  styleUrls: ['./items-ghosts.component.scss']
})
export class ItemsGhostsComponent {
  @Input('ghosts') ghosts: any[];
}
