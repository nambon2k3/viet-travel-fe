import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-service',
  templateUrl: './order-service.component.html',
  styleUrl: './order-service.component.css',
  imports: [
  ]
})
export class OrderServiceComponent {
  @Input() selectedService: any;
}
