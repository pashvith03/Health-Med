import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { AppComponent } from '../../app.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-features',
  imports: [SidebarComponent],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css',
})
export class FeaturesComponent {}
