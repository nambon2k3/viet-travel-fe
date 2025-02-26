import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-public-layout',
  imports: [
    RouterOutlet,
    AngularSvgIconModule,
    HeaderComponent,
  ],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css'
})
export class PublicLayoutComponent {
  private mainContent: HTMLElement | null = null;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (this.mainContent) {
          this.mainContent.scrollTop = 0; // Scroll to top on navigation
        }
      }
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
    this.mainContent = document.getElementById('main-content');
    }
  }
}
