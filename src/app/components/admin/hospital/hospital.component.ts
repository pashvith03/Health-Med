import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoService } from '../../../service/shared-image.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface ImageInfo {
  width: number;
  height: number;
  type: string;
  size: string;
}

@Component({
  selector: 'app-hospital',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.css'],
})
export class HospitalComponent implements OnInit, OnDestroy {
  droppedImage: string | null = null;
  sanitizedImageUrl: SafeUrl | null = null;
  isDragOver = false;
  isUploading = false;
  uploadProgress = 0;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  imageLoaded = false;
  imageInfo: ImageInfo | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private logoService: LogoService,
    private sanitizer: DomSanitizer
  ) {
    // Subscribe to logo updates
    this.logoService.logoUrl$
      .pipe(takeUntil(this.destroy$))
      .subscribe((url) => {
        console.log('Logo URL received in component:', url);

        if (!url) {
          this.droppedImage = null;
          this.sanitizedImageUrl = null;
          this.imageLoaded = false;
          this.imageInfo = null;
          return;
        }

        this.droppedImage = url;

        // Sanitize the URL for safe display
        if (url.startsWith('http')) {
          this.sanitizedImageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        } else if (url.startsWith('assets/')) {
          this.sanitizedImageUrl = url; // Asset URLs are already safe
        } else {
          // For other URLs, assume they're relative to the API
          const fullUrl = `${environment.apiUrl}${
            url.startsWith('/') ? '' : '/'
          }${url}`;
          this.sanitizedImageUrl =
            this.sanitizer.bypassSecurityTrustUrl(fullUrl);
        }

        console.log('Sanitized URL:', this.sanitizedImageUrl);
        this.imageLoaded = false;
      });
  }

  ngOnInit() {
    this.loadCurrentLogo();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCurrentLogo() {
    this.isUploading = true;
    this.imageLoaded = false;
    this.logoService
      .getLogo()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Current logo loaded:', response);

          this.isUploading = false;
          this.errorMessage = null;
          if (response && response.logoUrl) {
            const fullUrl =
              response.fullUrl ||
              this.logoService['getFullUrl'](response.logoUrl);

            this.droppedImage = fullUrl;
            console.log('droppedImage URL:', this.droppedImage);
          } else {
            this.droppedImage = null;
          }
        },
        error: (error) => {
          console.error('Error loading logo:', error);
          this.errorMessage = error.message || 'Failed to load current logo';
          this.droppedImage = null;
          this.isUploading = false;
          this.imageLoaded = false;
        },
      });
  }

  // Show success message with auto-dismiss
  private showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        this.handleFile(file);
      } else {
        this.errorMessage =
          'Please drop an image file (JPEG, PNG, GIF, WebP, etc.)';
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  createObjectURL(file: File): string {
    if (
      typeof window !== 'undefined' &&
      window.URL &&
      window.URL.createObjectURL
    ) {
      return window.URL.createObjectURL(file);
    }
    return '';
  }

  onBrowseClick(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        this.handleFile(target.files[0]);
      }
      document.body.removeChild(fileInput);
    });

    document.body.appendChild(fileInput);
    fileInput.click();
  }

  private handleFile(file: File): void {
    // Reset messages
    this.errorMessage = null;
    this.successMessage = null;

    // Client-side validation
    if (!file.type.startsWith('image/')) {
      this.errorMessage =
        'Please select an image file (JPEG, PNG, GIF, WebP, etc.)';
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      this.errorMessage =
        'File size too large. Please select an image under 15MB.';
      return;
    }
    const previousLogo = this.droppedImage;
    const tempUrl = this.createObjectURL(file);
    this.droppedImage = tempUrl;
    this.isUploading = true;
    this.uploadProgress = 0;

    this.logoService
      .uploadLogo(file)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isUploading = false;
          this.uploadProgress = 100;
          if (response.logoUrl) {
            URL.revokeObjectURL(tempUrl);
            this.showSuccess('Logo uploaded successfully');
          }
        },
        error: (error) => {
          console.error('Error uploading file:', error);
          this.isUploading = false;
          this.uploadProgress = 0;
          this.errorMessage = error.message || 'Failed to upload image';

          // Revert to previous state
          URL.revokeObjectURL(tempUrl);
          this.droppedImage = previousLogo;
        },
      });
  }

  // Remove image
  removeImage() {
    if (!this.droppedImage) return;

    const previousLogo = this.droppedImage;
    this.isUploading = true; // Show loading state
    this.errorMessage = null;
    this.successMessage = null;
    this.imageLoaded = false;
    this.imageInfo = null;

    this.logoService
      .deleteLogo()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (previousLogo && previousLogo.startsWith('blob:')) {
            URL.revokeObjectURL(previousLogo);
          }
          this.droppedImage = null;
          this.isUploading = false;
          this.showSuccess('Logo deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting logo:', error);
          this.errorMessage = error.message || 'Failed to delete logo';
          this.droppedImage = previousLogo; // Restore the previous logo
          this.isUploading = false;
        },
      });
  }

  handleImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    console.log('Image loaded successfully:', {
      src: img.src,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
    });

    // Add a small delay to ensure the image is fully rendered
    setTimeout(() => {
      this.imageLoaded = true;
      this.isUploading = false;
      this.errorMessage = null;

      // Only set image info if we have valid dimensions
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        this.imageInfo = {
          width: img.naturalWidth,
          height: img.naturalHeight,
          type: this.getImageType(img.src),
          size: this.getImageSize(img.src),
        };
      } else {
        console.warn('Image loaded but has invalid dimensions');
        this.imageInfo = null;
      }
    }, 100);
  }

  handleImageError(): void {
    console.error('Image failed to load:', {
      originalUrl: this.droppedImage,
      sanitizedUrl: this.sanitizedImageUrl,
      isLoaded: this.imageLoaded,
      isUploading: this.isUploading,
    });

    this.imageLoaded = false;
    this.imageInfo = null;
    this.errorMessage =
      'Failed to load image. Please check if the image URL is accessible.';
    this.isUploading = false;

    // Try loading the image again with a cache-busting parameter
    if (this.droppedImage && this.droppedImage.startsWith('http')) {
      const cacheBuster = `?t=${new Date().getTime()}`;
      this.sanitizedImageUrl = this.sanitizer.bypassSecurityTrustUrl(
        this.droppedImage + cacheBuster
      );
    }
  }

  private getImageType(url: string): string {
    if (url.startsWith('data:image/')) {
      return url.split(';')[0].split('/')[1].toUpperCase();
    } else if (url.includes('.')) {
      const extension = url.split('.').pop()?.toUpperCase() || 'Unknown';
      return extension;
    }
    return 'Unknown';
  }

  private getImageSize(url: string): string {
    if (url.startsWith('data:')) {
      const base64Length = url.split(',')[1].length;
      const sizeInBytes = (base64Length * 3) / 4;
      return this.formatFileSize(sizeInBytes);
    }
    return 'Unknown';
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
