import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BonusDeductionsComponent } from './bonus-deductions.component';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [{
  path: '',
  component: BonusDeductionsComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BonusDeductionsRoutingModule { }
