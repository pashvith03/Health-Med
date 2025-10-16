import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LogoService } from '../../service/shared-image.service';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit, OnDestroy {
  logoUrl: string | null = null;
  private logoSubscription: Subscription | null = null;
  private destroy$ = new Subject<void>();
  sanitizedImageUrl: SafeUrl | null = null;
  role: string | null = null;
  constructor(
    private logoService: LogoService,
    private sanitizer: DomSanitizer
  ) {
    this.role = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') || '{}').role.name
      : null;
    console.log(this.role);
  }

  ngOnInit() {
    // Subscribe to logo response changes
    this.logoSubscription = this.logoService.logoResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response?.logoUrl) {
          this.updateLogoUrl(response.logoUrl);
        } else {
          this.handleImageError();
        }
      });

    // Load initial logo
    this.loadCurrentLogo();
  }

  private updateLogoUrl(url: string) {
    if (!url) {
      this.handleImageError();
      return;
    }

    // Construct the full URL based on the URL type
    let fullUrl: string;
    if (url.startsWith('http')) {
      fullUrl = url;
    } else if (url.startsWith('assets/')) {
      fullUrl = url;
    } else if (url.startsWith('/uploads')) {
      // For uploaded files, use the complete server URL
      fullUrl = `http://localhost:3000${url}`;
    } else {
      fullUrl = `${environment.apiUrl}/${url.replace(/^\//, '')}`;
    }

    this.sanitizedImageUrl = fullUrl;
  }

  handleImageError(): void {
    // Hospital icon as fallback
    const fallbackSvg =
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xOSAySDVhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDE0YTIgMiAwIDAgMCAyLTJWNGEyIDIgMCAwIDAtMi0yeiI+PC9wYXRoPjxwYXRoIGQ9Ik0xMiAydjIwIj48L3BhdGg+PHBhdGggZD0iTTIgMTJoMjAiPjwvcGF0aD48L3N2Zz4=';
    this.sanitizedImageUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(fallbackSvg);
  }

  private loadCurrentLogo() {
    this.logoService
      .getLogo()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response && response.logoUrl) {
            this.updateLogoUrl(response.logoUrl);
          }
        },
        error: (error) => {
          console.error('Error loading logo:', error);
          this.handleImageError();
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.logoSubscription) {
      this.logoSubscription.unsubscribe();
    }
  }
}
