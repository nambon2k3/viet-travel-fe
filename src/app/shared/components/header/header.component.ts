import { Component, AfterViewInit, OnDestroy, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { SsrService } from '../../../core/services/ssr.service';
import { UserStorageService } from '../../../core/services/user-storage/user-storage.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [CommonModule]
})
export class HeaderComponent implements AfterViewInit, OnDestroy, OnInit {
  userProfile: any;
  isScrolled = false;
  private mainContent: HTMLElement | null = null;
  isProfileOpen = false;
  isLoggedIn = false;
  username = '';
  isHomepage = false;

  constructor(
    private userStorageService: UserStorageService,
    public router: Router,
    private ssrService: SsrService
  ) {}

  ngOnInit(): void {
    const doc = this.ssrService.getDocument();
    if (doc) {
      this.checkLoginStatus();

      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.isHomepage = this.router.url === '/homepage' || this.router.url === '/';
        }
      });

      doc.addEventListener('show.bs.modal', () => {
        document.body.classList.add('no-scroll');
      });

      doc.addEventListener('hide.bs.modal', () => {
        document.body.classList.remove('no-scroll');
      });
    }
  }

  checkLoginStatus() {
    const user = this.userStorageService.getUser();
    if (user) {
      this.isLoggedIn = true;
      this.username = user.username;
    } else {
      this.isLoggedIn = false;
    }
  }

  toggleProfileMenu() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  closeProfileMenu() {
    this.isProfileOpen = false;
  }

  goHomepage(): void {
    this.router.navigate(['/homepage']);
  }

  ngAfterViewInit(): void {
    const doc = this.ssrService.getDocument();
    if (doc) {
      this.mainContent = doc.getElementById('main-content');
      if (this.mainContent) {
        this.mainContent.addEventListener('scroll', this.onScroll);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.mainContent) {
      this.mainContent.removeEventListener('scroll', this.onScroll);
    }

    const doc = this.ssrService.getDocument();
    if (doc) {
      doc.removeEventListener('show.bs.modal', () => {});
      doc.removeEventListener('hide.bs.modal', () => {});
    }
  }

  @HostListener('window:scroll', [])
  onScroll = () => {
    if (this.mainContent && this.isHomepage) {
      const isModalOpen = document.body.classList.contains('modal-open');
      if (!isModalOpen) {
        const scrollPosition = this.mainContent.scrollTop;
        this.isScrolled = scrollPosition > 300;
      }
    }
  };

  onLogout() {
    UserStorageService.signOut();
    this.isLoggedIn = false;
    this.router.navigate(['/homepage']);
  }
}