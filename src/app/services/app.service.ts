import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ITradeData } from '../interfaces/app.interface';

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
}
