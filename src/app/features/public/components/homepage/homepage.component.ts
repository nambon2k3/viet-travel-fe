import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { title } from 'process';
import { CustomerService } from '../../../customer/services/customer.service';

@Component({
  selector: 'app-homepage',
  imports: [
    AngularSvgIconModule,
    CommonModule
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  selectedCategory: string = 'Search All';
  searchPlaceholder: string = 'Search...';
  searchTitle: string = 'Where to?';
  userProfile: any;

  categories = [
    { name: 'Search All', title: "Where to?", placeholder: 'Places to go, things to do, hotels...' },
    { name: 'Hotels', title: "Stay somewhere great", placeholder: 'Hotel name or destination' },
    { name: 'Restaurants', title: "Find places to eat", placeholder: 'Restaurant or destination' },
    { name: 'Flights', title: "Find the best flight", placeholder: 'Search for Flights...' },
    { name: 'Activity', title: "Exprience something new", placeholder: 'Attraction, activity or destination' },
    { name: 'Tours', title: "Explore the best tours", placeholder: 'Tour or destination' }
  ];
  
  selectCategory(category: any) {
    this.selectedCategory = category.name;
    this.searchPlaceholder = category.placeholder;
    this.searchTitle = category.title;
  }
}
