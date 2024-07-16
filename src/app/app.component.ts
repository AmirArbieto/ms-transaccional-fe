import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Asegúrate de que este archivo contenga los estilos CSS definidos anteriormente
})
export class AppComponent {
  title = 'mi-app';
  isSidebarClosed = true;
  isSidebarHoverable = false;
  isDarkMode = false;
  isTreasurySubmenuOpen = false;

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  expandSidebar() {
    this.isSidebarClosed = false;
  }

  collapseSidebar() {
    this.isSidebarClosed = true;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  toggleTreasurySubmenu() {
    this.isTreasurySubmenuOpen = !this.isTreasurySubmenuOpen;
  }
}
