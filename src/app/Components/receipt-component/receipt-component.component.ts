import { Component, inject } from '@angular/core';
import { OpenAIService } from '../../Services/open-aiservice.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-receipt-component',
  imports: [FormsModule,CommonModule],
  templateUrl: './receipt-component.component.html',
  styleUrl: './receipt-component.component.scss'
})
export class ReceiptComponentComponent {
  prompt = '';
  data = {
    name: '',
    accountNumber: '',
    ifsc: '',
    amount: '',
    bank: '',
    mode: 'OTHER BANK NEFT API'
  };
  transactionId = '';
  currentDate = '';
  receiptGenerated = false;
  loading = false;

  injectedOpenAIService = inject(OpenAIService);

  constructor(private openAIService: OpenAIService) {}


  showReceipt = false;

  generateFromPrompt() {
    this.loading = true;
    this.showReceipt = false;
    this.receiptGenerated = false;

    this.openAIService.extractReceiptData(this.prompt).then(response => {
      this.data = {
        name: response['Beneficiary Name'],
        accountNumber: response['Account Number'],
        ifsc: response['IFSC'],
        amount: response['Amount (in INR)'],
        bank: response['Bank Name'],
        mode: response['Payment Mode'] || 'OTHER BANK NEFT API'
      };
      //this.currentDate = response['Current Date'] || new Date().toLocaleDateString('en-GB');
      this.currentDate = new Date().toLocaleDateString('en-GB');
      this.transactionId = Math.floor(Math.random() * 1e14).toString();
      this.receiptGenerated = true;
      this.loading = false;
    }).catch(() => {
      alert('Failed to generate receipt. Try again.');
      this.loading = false;
    });
  }



}
