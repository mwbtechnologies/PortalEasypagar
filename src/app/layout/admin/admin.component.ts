import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
isSidebarVisible = false
ngOnInit(){
  // console.log(this.isSidebarVisible,"admincomponent");
  
}
toggleSidebar() {
  this.isSidebarVisible = !this.isSidebarVisible;
}
@HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const sidebarElement = document.querySelector('.app-sidebar');
    const headerButtonElement = document.querySelector('.header-right-icons button');

    if (sidebarElement && headerButtonElement) {
      if (!sidebarElement.contains(event.target as Node) && !headerButtonElement.contains(event.target as Node)) {
        this.isSidebarVisible = false;
      }
    }
  }
}

