import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ITradeData } from '../interfaces/app.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AppService {
  public tradesData$: BehaviorSubject<ITradeData[]> = new BehaviorSubject<ITradeData[]>([]);
  public currentPage$ = new BehaviorSubject<string | undefined>('');

  constructor(
    private router: Router
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        const currentPage = this.router.url.split('/').pop();
        this.currentPage$.next(currentPage);
      }
    });
  }

  navigateTo(): void {
    const newLink = this.currentPage$.getValue() === 'table' ? 'chart' : 'table';
    this.router.navigate([newLink]).then();
  }

  deleteTrade(element: ITradeData): void {
    const tradeArray = this.tradesData$.getValue();
    let index = tradeArray.findIndex(data => data._id === element._id);
    tradeArray.splice(index, 1);
    this.tradesData$.next(tradeArray);
  }

  calculateChart(data: ITradeData[]): { dateArray: string[], profitArray: number[] } {
    const parsedData = data
      .map(item => ({ profit: item.profit, date: item.exitDate }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const chartData = parsedData.reduce((acc: any, cV) => {
      if (!acc[cV.date]) {
        acc[cV.date] = 0;
      }
      acc[cV.date] = acc[cV.date] + cV.profit;
      return acc;
    }, {});
    let dateArray = Object.keys(chartData);
    dateArray = dateArray
      .map(date => new Date(date).toLocaleDateString('ru-RU'));
    let sum = 0;
    const profitArray = Object.values(chartData).map((item: any) => {
      const res = item + sum;
      sum += item;
      return res;
    });
    return { dateArray, profitArray };
  }
}
