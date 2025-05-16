import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private apiKey = 'REMOVED_API_KEY'; // Replace with your actual key

  async extractReceiptData(prompt: string): Promise<any> {
    const fullPrompt = `
    Extract the following details from the text and if are not present, assume the values:
    - Beneficiary Name
    - Account Number
    - IFSC (if any)
    - Bank Name
    - Amount (in INR)
    - Payment Mode (assume NEFT if not given)
    - Current Date (DD/MM/YYYY format)
    Return JSON format only.
    Text: "${prompt}"
    `;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: fullPrompt }],
        temperature: 0.2
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        }
      }
    );

    try {
      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      throw new Error('Failed to parse JSON from GPT response');
    }
  }
}
