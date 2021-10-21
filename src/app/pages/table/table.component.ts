import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITradeData } from '../../interfaces/app.interface';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less']
})
export class TableComponent implements OnInit, OnDestroy {
  public displayedColumns = ['Entry date', 'Entry price', 'Exit date', 'Exit price', 'Profit', 'actions'];
  public dataSource: MatTableDataSource<ITradeData>;
  public dataSource$: Observable<boolean>;
  private _subscriptions: Subscription[] = [];

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.dataSource$ = this.appService.tradesData$.pipe(map(data => !!data.length));
    this._subscriptions = [
      this.appService.tradesData$.subscribe(tradesData => this.onGetTradesData(tradesData))
    ];
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onGetTradesData(tradesData: ITradeData[]): void {
    this.dataSource = new MatTableDataSource<ITradeData>(tradesData);
  }

  onEditTrade(tradeData: ITradeData): void {
    this.appService.openManageModal(tradeData);
  }

  onDeleteTrade(element: ITradeData): void {
    this.appService.deleteTrade(element);
  }
}
