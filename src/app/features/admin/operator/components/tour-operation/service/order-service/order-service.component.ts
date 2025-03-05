import { Component, Input } from '@angular/core';
import { BlogContentComponent } from "../../../../../marketer/components/blog-detail/blog-content/blog-content.component";

@Component({
  selector: 'app-order-service',
  templateUrl: './order-service.component.html',
  styleUrl: './order-service.component.css',
  imports: [
    BlogContentComponent
]
})
export class OrderServiceComponent {
  @Input() selectedService: any;
}
