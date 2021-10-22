import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ITradeData } from '../../../../interfaces/app.interface';
import { AppService } from '../../../../services/app.service';

@Component({
  selector: 'app-add-edit-modal',
  templateUrl: './add-edit-modal.component.html',
  styleUrls: ['./add-edit-modal.component.less']
})
export class AddEditModalComponent implements OnInit, OnDestroy {
  tradeForm: FormGroup;
  tradeData: ITradeData;
  subscriptions: Subscription[];
  private currentBalance: number | undefined;

  constructor(
    public dialogRef: MatDialogRef<AddEditModalComponent>,
    public appService: AppService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    this.tradeData = data;
  }

  ngOnInit(): void {
    this.tradeForm = this.formBuilder.group({
      entryDate: [this.tradeData?.entryDate || null, [Validators.required]],
      exitDate: [this.tradeData?.exitDate || null, [Validators.required]],
      entryPrice: [this.tradeData?.entryPrice || null, [Validators.required, Validators.min(0)]],
      exitPrice: [this.tradeData?.exitPrice || null, [Validators.required, Validators.min(0)]],
      profit: [this.tradeData?.profit || null, [this.validateProfit()]],
    });
    this.subscriptions = [
      this.appService.tradesData$.subscribe(data => this.onGetTradeData(data))
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  validateProfit(): ValidatorFn {
    return (control): ValidationErrors | null => {
      if (this.tradeData) {
        return (+control.value + (this.currentBalance || 0) - this.tradeData.profit!) < 0 ? { incorrect: true } : null;
      }
      return (+control.value + (this.currentBalance || 0)) < 0 ? { incorrect: true } : null;
    }
  }

  calculateProfit(): void {
    if (this.tradeForm.controls.exitPrice.value && this.tradeForm.controls.entryPrice.value) {
      this.tradeForm.controls.profit.setValue(
        +this.tradeForm.controls.exitPrice.value - +this.tradeForm.controls.entryPrice.value
      );
    } else {
      this.tradeForm.controls.profit.setValue(null);
    }
  }

  closeModal(): void {
    const saveActionData = {
      trade: this.tradeForm.getRawValue(),
      action: ''
    };
    saveActionData.action = this.tradeData ? 'update' : 'create';
    this.dialogRef.close(saveActionData);
  }

  private onGetTradeData(data: ITradeData[]) {
    const { profitArray } = this.appService.calculateChart(data);
    this.currentBalance = profitArray.pop();
  }
}
