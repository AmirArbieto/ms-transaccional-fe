import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  body: HTMLBodyElement;
  sidebar: HTMLElement;
  submenuItems: NodeListOf<Element>;
  darkLight!: HTMLElement;  // Usando el modificador `!`
  sidebarOpen!: HTMLElement;  // Usando el modificador `!`
  sidebarClose: HTMLElement;
  sidebarExpand: HTMLElement;
  isDarkMode = false;
  isSidebarClosed = false;
  isSidebarHoverable = false;
  isTreasurySubmenuOpen = false;
  isProfileMenuOpen = false; // Añade esta línea

  constructor(private router: Router) {
    // Obtener las referencias a los elementos del DOM en el constructor
    this.body = document.querySelector("body") as HTMLBodyElement;
    this.sidebar = document.querySelector(".sidebar") as HTMLElement;
    this.submenuItems = document.querySelectorAll(".submenu_item");
    this.sidebarClose = document.querySelector(".collapse_sidebar") as HTMLElement;
    this.sidebarExpand = document.querySelector(".expand_sidebar") as HTMLElement;
  }

  ngOnInit() {
    console.log('Running...')
  }

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
    if (this.isSidebarClosed) {
      this.body.classList.remove('menu-open');
    } else {
      this.body.classList.add('menu-open');
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      this.body.classList.add('dark-mode');
      this.darkLight.classList.replace("bx-sun", "bx-moon");
    } else {
      this.body.classList.remove('dark-mode');
      this.darkLight.classList.replace("bx-moon", "bx-sun");
    }
  }

  toggleTreasurySubmenu() {
    this.isTreasurySubmenuOpen = !this.isTreasurySubmenuOpen;
  }

  expandSidebar() {
    this.isSidebarClosed = false;
  }

  collapseSidebar() {
    this.isSidebarClosed = true;
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logout() {
    // Lógica para cerrar sesión, si es necesario
    this.router.navigate(['/pagina-web']);
  }
}
