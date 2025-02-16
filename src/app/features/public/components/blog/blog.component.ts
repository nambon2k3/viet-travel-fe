import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from "../../../../shared/components/footer/footer.component";

interface Article {
  title: string;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-blog',
  imports: [
    CommonModule,
    FooterComponent
],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})

export class BlogComponent {
  articles: Article[] = [
    {
      title: '12 incredible places to travel in February around the world',
      description: 'From total restoration in Todos Santos, Mexico, to twilight skiing in Northern Idaho.',
      imageUrl: 'https://cdn.pixabay.com/photo/2017/10/12/03/03/view-2843338_1280.jpg',
    },
    {
      title: 'Top 10 destinations for solo travelers',
      description: 'Experience the freedom of solo adventures with these amazing destinations.',
      imageUrl: 'https://cdn.pixabay.com/photo/2017/10/12/03/03/view-2843338_1280.jpg',
    },
    {
      title: 'The most romantic cities to visit this year',
      description: 'Make unforgettable memories in the most romantic cities around the globe.',
      imageUrl: 'https://cdn.pixabay.com/photo/2017/10/12/03/03/view-2843338_1280.jpg',
    }
  ];

  currentIndex = 0;

  prevArticle() {
    this.currentIndex = (this.currentIndex - 1 + this.articles.length) % this.articles.length;
  }

  nextArticle() {
    this.currentIndex = (this.currentIndex + 1) % this.articles.length;
  }

  cards = Array(6).fill(0); // Tạo 6 thẻ

  // Mảng bài viết (dữ liệu mẫu)
  article = [
    {
      title: '7 perfect days in Florence',
      imageUrl: 'https://via.placeholder.com/300x400', // Đổi thành URL ảnh thực tế
    },
    {
      title: 'A perfect day in Florence',
      imageUrl: 'https://via.placeholder.com/300x200',
    },
    {
      title: 'A perfect day in London',
      imageUrl: 'https://via.placeholder.com/300x400',
    },
    {
      title: 'A guide for walking across the Brooklyn Bridge',
      imageUrl: 'https://via.placeholder.com/300x400',
    },
    {
      title: "A local's guide to the best skyline experiences in Midtown Manhattan",
      imageUrl: 'https://via.placeholder.com/300x200',
    },
    {
      title: 'The 4 best areas to stay in NYC: a vibes-based guide',
      imageUrl: 'https://via.placeholder.com/300x400',
    },
    {
      title: 'A guide for walking across the Brooklyn Bridge',
      imageUrl: 'https://via.placeholder.com/300x400',
    },
    {
      title: "A local's guide to the best skyline experiences in Midtown Manhattan",
      imageUrl: 'https://via.placeholder.com/300x200',
    },
    {
      title: 'The 4 best areas to stay in NYC: a vibes-based guide',
      imageUrl: 'https://via.placeholder.com/300x400',
    },
  ];
}
