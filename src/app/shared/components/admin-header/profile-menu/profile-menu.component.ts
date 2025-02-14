import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-menu',
  imports: [
    CommonModule,
    AngularSvgIconModule,
    RouterLink
  ],
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.css',
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          transform: 'translateY(0)',
          visibility: 'visible',
        }),
      ),
      state(
        'closed',
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
          visibility: 'hidden',
        }),
      ),
      transition('open => closed', [animate('0.2s')]),
      transition('closed => open', [animate('0.2s')]),
    ]),
  ],
})
export class ProfileMenuComponent implements OnInit {
  public isOpen = false;
  public profileMenu = [
    {
      title: 'Your Profile',
      icon: './assets/icons/heroicons/outline/user-circle.svg',
      link: '/profile',
    },
    {
      title: 'Settings',
      icon: './assets/icons/heroicons/outline/cog.svg',
      link: '/settings',
    },
    {
      title: 'Log out',
      icon: './assets/icons/heroicons/outline/logout.svg',
      link: '/auth',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  public toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }
}
