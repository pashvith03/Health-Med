import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appIcon]', // This is how we'll use the directive in our HTML
})
export class IconDirective implements OnInit {
  // Use @Input() to allow passing the icon name from the HTML
  // e.g., <button [appIcon]="'edit'"></button>
  @Input() appIcon: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // We run the logic in ngOnInit to make sure the @Input() value is available
    const iconSvg = this.getIconSvg(this.appIcon);

    if (iconSvg) {
      // Create a container, parse the SVG string into a real element
      const container = this.renderer.createElement('span');
      container.innerHTML = iconSvg;
      const svgElement = container.firstChild;

      if (svgElement) {
        // Add some default styles to the icon
        this.renderer.setStyle(svgElement, 'width', '16px');
        this.renderer.setStyle(svgElement, 'height', '16px');
        this.renderer.setStyle(svgElement, 'margin-right', '8px'); // Space between icon and text

        // Add the icon to the beginning of the button
        this.renderer.insertBefore(
          this.el.nativeElement,
          svgElement,
          this.el.nativeElement.firstChild
        );

        // Optional: Style the button itself to align icon and text nicely
        this.renderer.setStyle(this.el.nativeElement, 'display', 'inline-flex');
        this.renderer.setStyle(this.el.nativeElement, 'align-items', 'center');
      }
    }
  }

  // A helper function to store and retrieve SVG code
  private getIconSvg(iconName: string): string {
    const icons: { [key: string]: string } = {
      edit: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293z"/>
        </svg>
      `,
      delete: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3V2h11v1z"/>
        </svg>
      `,
      // You can add more icons here!
      // 'add': `<svg>...</svg>`
    };
    return icons[iconName] || ''; // Return the SVG code or an empty string if not found
  }
}