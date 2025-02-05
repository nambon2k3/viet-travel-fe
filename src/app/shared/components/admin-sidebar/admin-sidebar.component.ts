import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { layoutService } from '../../../features/admin/layout/services/layout.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import packageJson from '../../../../../package.json';
import { AdminSidebarMenuComponent } from './admin-sidebar-menu/admin-sidebar-menu.component';

@Component({
  selector: 'app-admin-sidebar',
  imports: [
    CommonModule,
    AdminSidebarMenuComponent,
    AngularSvgIconModule
  ],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent implements OnInit {
  public appJson: any = packageJson;

  constructor(public layoutService: layoutService) {}

  ngOnInit(): void {}

  public toggleSidebar() {
    this.layoutService.toggleSidebar();
  }
}
