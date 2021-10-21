import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public navigationLink$: Observable<string>;
  public tradeData$: Observable<boolean>;

  constructor(
    private appService: AppService
  ) {
    this.navigationLink$ = this.appService.currentPage$.pipe(map((value) => value === 'table' ? 'chart' : 'table'));
    this.tradeData$ = this.appService.tradesData$.pipe(map(data => !!data.length));
  }

  navigateTo(): void {
    this.appService.navigateTo();
  }

  openDialog(): void {
    this.appService.openManageModal();
  }
}
