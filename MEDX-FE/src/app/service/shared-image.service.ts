import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface LogoResponse {
  logoUrl: string | null;
  fullUrl?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LogoService {
  private logoUrlSubject = new BehaviorSubject<string | null>(null);
  private logoResponseSubject = new BehaviorSubject<LogoResponse | null>(null);

  logoUrl$ = this.logoUrlSubject.asObservable();
  logoResponse$ = this.logoResponseSubject.asObservable();

  private apiUrl = `${environment.apiUrl}/hospital-logo`;
  private defaultLogoPath = 'assets/default-logo.png';
  private currentLogoUrl: string | null = null;

  constructor(private http: HttpClient) {}

  private getFullUrl(url: string | null): string {
    if (url?.startsWith('/uploads')) {
      const baseUrl = 'http://localhost:3000'; // Direct server URL without /api
      const fullUrl = `${baseUrl}${url}`;
      return fullUrl;
    }

    // Only return default logo if url is explicitly null/undefined
    if (!url) {
      return this.defaultLogoPath;
    }

    if (url.startsWith('http')) {
      return url;
    }

    const fullUrl = `${environment.apiUrl}${
      url.startsWith('/') ? '' : '/'
    }${url}`;
    return fullUrl;
  }

  setLogo(logoResponse: LogoResponse | null, tempUrl?: string) {
    console.log('setLogo called with:', {
      logoResponse,
      tempUrl,
      hasLogoUrl: logoResponse?.logoUrl ? 'yes' : 'no',
    });

    if (!logoResponse || !logoResponse.logoUrl) {
      console.log('Using default logo path:', this.defaultLogoPath);
      this.currentLogoUrl = this.defaultLogoPath;
      this.logoUrlSubject.next(this.defaultLogoPath);
      this.logoResponseSubject.next(null);
      return;
    }

    // Always use tempUrl if provided, otherwise construct from logoUrl
    const finalUrl = tempUrl || this.getFullUrl(logoResponse.logoUrl);
    console.log('Setting final URL:', finalUrl);
    console.log('Original logo URL:', logoResponse.logoUrl);

    this.currentLogoUrl = finalUrl;
    this.logoUrlSubject.next(finalUrl);
    this.logoResponseSubject.next(logoResponse);
  }

  // Upload logo to backend
  uploadLogo(file: File): Observable<LogoResponse> {
    const formData = new FormData();
    formData.append('logo', file);

    return this.http.post<LogoResponse>(this.apiUrl, formData).pipe(
      tap((response) => {
        if (response?.logoUrl) {
          const imageUrl =
            response.fullUrl || this.getFullUrl(response.logoUrl);
          // Create a temporary URL for immediate display
          const tempUrl = URL.createObjectURL(file);
          this.setLogo(response, tempUrl);

          // Verify the actual URL is accessible
          this.verifyImageUrl(imageUrl).then((isValid) => {
            if (isValid) {
              URL.revokeObjectURL(tempUrl);
              this.setLogo(response, imageUrl);
            }
          });
        }
      }),
      catchError((error) => {
        console.error('Error uploading logo:', error);
        if (error.status === 413) {
          throw new Error('File size too large');
        } else if (error.status === 415) {
          throw new Error('Invalid file type');
        } else if (error.status === 401) {
          throw new Error('Please log in to upload a logo');
        } else {
          throw new Error(error.error?.message || 'Failed to upload logo');
        }
      })
    );
  }

  // Get logo from backend
  getLogo(): Observable<LogoResponse> {
    console.log('Getting logo from API URL:', this.apiUrl);
    return this.http.get<LogoResponse>(this.apiUrl).pipe(
      tap((response) => {
        console.log('Raw API Response:', response);
        if (response?.logoUrl) {
          const imageUrl = this.getFullUrl(response.logoUrl);
          console.log('Constructed image URL:', imageUrl);
          // Pass both response and constructed URL
          this.setLogo(response, imageUrl);
        } else {
          console.log('No logo URL in response');
          this.setLogo(null);
        }
      }),
      catchError((error) => {
        console.error('Error fetching logo:', error);
        this.setLogo(null);
        throw new Error(error.error?.message || 'Failed to load logo');
      })
    );
  }

  private verifyImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  // Delete logo from backend
  deleteLogo(): Observable<LogoResponse> {
    const deleteUrl = `${this.apiUrl}/active`;
    return this.http.delete<LogoResponse>(deleteUrl).pipe(
      tap((response) => {
        this.setLogo(null);
      }),
      catchError((error) => {
        console.error('Error deleting logo:', error);
        if (error.status === 401) {
          throw new Error('Please log in to delete the logo');
        } else if (error.status === 404) {
          throw new Error('No logo found to delete');
        } else {
          throw new Error(error.error?.message || 'Failed to delete logo');
        }
      })
    );
  }
}
