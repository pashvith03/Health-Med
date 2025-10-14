import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, NavBarComponent, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  role: string | null = null;
  constructor() {
    this.role = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') || '{}').role.name
      : null;
    console.log(this.role);
  }
}
