import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService } from './services/app.service';
import { AddEditModalComponent } from './pages/table/components/add-edit-modal/add-edit-modal.component';
import { v4 as uuidv4 } from 'uuid';
import { MatDialog } from '@angular/material/dialog';
import { ITradeData } from './interfaces/app.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public navigationLink$: Observable<string>;
  public tradeData$: Observable<boolean>;

  constructor(
    private appService: AppService,
    private dialog: MatDialog
  ) {
    this.navigationLink$ = this.appService.currentPage$.pipe(map((value) => value === 'table' ? 'chart' : 'table'));
    this.tradeData$ = this.appService.tradesData$.pipe(map(data => !!data.length));
  }

  navigateTo(): void {
    this.appService.navigateTo();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddEditModalComponent);
    dialogRef.afterClosed().subscribe(data => {
      if (data?.action === 'create') {
        const newTrade = {
          ...data.trade,
          _id: uuidv4()
        }
        this.appService.tradesData$.next([...this.appService.tradesData$.getValue(), newTrade]);
      }
    });
  }
}
