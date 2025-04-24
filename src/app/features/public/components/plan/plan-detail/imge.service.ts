// src/app/services/image-search.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageSearchService {
  private readonly apiKey = 'e8ec042e9f61f50bb94e5a67b378b7ad326d286200be7ef702c68b3481a1dadf';
  private readonly baseUrl = 'https://serpapi.com/search.json';

  constructor(private http: HttpClient) {}

  async getImageUrl(query: string): Promise<string> {
    console.log('Fetching image for query:', query);
    const params = {
      engine: 'google_images',
      q: query,
      api_key: this.apiKey
    };

    try {
      const response: any = await firstValueFrom(this.http.get(this.baseUrl, { params }));
      return response.images_results?.[0]?.thumbnail ?? 'https://via.placeholder.com/300';
    } catch (err) {
      console.error('Error fetching image:', err);
      return 'https://via.placeholder.com/300';
    }
  }
}
