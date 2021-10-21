import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import * as echarts from 'echarts';
import { AppService } from '../../services/app.service';
import { ITradeData } from '../../interfaces/app.interface';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.less']
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  private chartDom: any;
  @ViewChild('chart') set content(content: ElementRef) {
    if (content && content.nativeElement) {
      this.chartDom = content.nativeElement;
      this.myChart = echarts.init(this.chartDom);
    }
  }
  private myChart: any;
  private subscriptions: Subscription[];

  constructor(
    private appService: AppService
  ) {
  }

  ngAfterViewInit(): void {
    this.subscriptions = [
      this.appService.tradesData$.subscribe(data => this.onGetTradeData(data))
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription?.unsubscribe());
  }

  private onGetTradeData(data: ITradeData[]): void {
    if (!data.length) {
      return this.appService.navigateTo();
    }
    const parsedData = data.map(item => ({ profit: item.profit, date: item.exitDate }));
    const chartData = parsedData.reduce((acc: any, cV) => {
      if (!acc[cV.date]) {
        acc[cV.date] = 0;
      }
      acc[cV.date] = acc[cV.date] + cV.profit;
      return acc;
    }, {});
    let dateArray = Object.keys(chartData);
    const profitArray = Object.values(chartData);
    dateArray = dateArray
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map(date => new Date(date).toLocaleDateString("en-US"));
    this.setCharOptions(dateArray, profitArray);
  }

  private setCharOptions(date: string[], values: any[]): void {
    const options = {
      xAxis: {
        type: 'category',
        data: date
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: values,
          type: 'bar'
        }
      ]
    };
    this.myChart?.setOption(options);
  }
}
