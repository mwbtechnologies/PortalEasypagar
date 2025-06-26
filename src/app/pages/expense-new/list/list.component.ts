import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  selectedTab = 0;
  loadedTabs: Set<number> = new Set([0]);
  constructor(
    private _router: Router){

    }
  onTabChange(index: number) {
    this.loadedTabs.add(index);
  }

  isLoaded(index: number): boolean {
    return this.loadedTabs.has(index);
  }
  backToDashboard(){
    this._router.navigate(["appdashboard"]);
  }
}
