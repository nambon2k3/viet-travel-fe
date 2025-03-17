import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SsrService } from '../../../../core/services/ssr.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];

  constructor(private ssrService: SsrService) {}

  ngOnInit() {
    const loc = this.ssrService.getLocalStorage();
    if (loc) {
      const storedWishlist = localStorage.getItem('wishlist');
      this.wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
    }
  }

  removeFromWishlist(index: number) {
    this.wishlist.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }
}