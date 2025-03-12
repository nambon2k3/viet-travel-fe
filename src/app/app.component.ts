import { Component, Inject, PLATFORM_ID, OnInit, AfterViewInit } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  title = 'Viet Travel';
  isBrowser: boolean = false;
  isServer: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.isServer = isPlatformServer(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.initializeClientFeatures();
    }
  }

  private initializeClientFeatures() {
    setTimeout(() => {
      if (this.isBrowser) {
        document.title = 'Viet Travel - Explore the World';
      }
    }, 100);
  }
}