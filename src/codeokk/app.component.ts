import { Component, Renderer2 } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { RouterOutlet } from "@angular/router";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  showSidebar = true;
  showHeader: boolean = true;
  showFooter: boolean = true;
  title = "UnStop-UI";
  constructor(
    private matIconReg: MatIconRegistry,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.matIconReg.setDefaultFontSetClass("material-symbols-outlined");
    // Set initial theme colors
    this.setThemeColors("#0099fe", "#ebf3fb");
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        // Hide header for specific routes
        this.showHeader = !(url.includes("/login") || url.includes("/signup"));
        this.showFooter = !url.startsWith("/user/dashboard");
      });
  }

  // this.productService.getAppColor().subscribe((response: any) => {
  //   document.documentElement.style.setProperty(
  //     "--dynamic-app-color",
  //     "#BD6A06 "
  //   );
  // });

  setThemeColors(primaryColor: string, secondaryColor: string): void {
    document.documentElement.style.setProperty(
      "--primary-app-color",
      primaryColor
    );
    document.documentElement.style.setProperty(
      "--secondary-app-color",
      secondaryColor
    );
  }
}
