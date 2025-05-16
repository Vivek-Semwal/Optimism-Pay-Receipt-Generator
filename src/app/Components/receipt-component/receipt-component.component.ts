import { Component, inject } from '@angular/core';
import { OpenAIService } from '../../Services/open-aiservice.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


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






  downloadReceiptAsImage() {
  const receiptElement = document.querySelector('.receipt-content') as HTMLElement;
  html2canvas(receiptElement).then(canvas => {
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'optimism-pay-receipt.png';
    link.click();
  });
}

downloadReceiptAsPDF() {
  const receiptElement = document.querySelector('.receipt-content') as HTMLElement;
  html2canvas(receiptElement).then(canvas => {
    const imageData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('optimism-pay-receipt.pdf');
  });
}





}
