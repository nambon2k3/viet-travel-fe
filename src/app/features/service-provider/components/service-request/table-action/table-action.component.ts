import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-table-action',
  imports: [AngularSvgIconModule],
  templateUrl: './table-action.component.html',
  styleUrl: './table-action.component.css',
})
export class TableActionComponent {
  

  @Input() totalItems = 0;
  @Input() pageItems = 0;
  @Output() onFilter = new EventEmitter<{search: string, orderType: string, status: boolean | undefined}>();


  search: string = '';
  orderType: string = 'Newest';
  status: boolean | undefined = undefined;

  constructor() { }


  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search = value;
  }
  onOrderSelected(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.orderType = value;
  }
  onStatusSelected(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if(value.toLowerCase() === 'all') {
      this.status = undefined;
      console.log(this.status)
      return;

    }
    this.status = value !== 'Active';
  }

  filter() {
    this.onFilter.emit({
      search: this.search,
      orderType: this.orderType,
      status: this.status
    });
    console.log(this.status)
  }


}
