import { Component, inject } from '@angular/core';
import { OrdersComponent } from './features/orders/orders/orders.component';
import { AnalyticsComponent } from './features/analytics/analytics.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-root',
  imports: [OrdersComponent, AnalyticsComponent, TranslateModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './app.component.html',
})
export class App {
  private readonly translateService = inject(TranslateService);

  readonly supportedLanguages: { value: 'en' | 'bn'; labelKey: string }[] = [
    { value: 'en', labelKey: 'app.language.en' },
    { value: 'bn', labelKey: 'app.language.bn' },
  ];

  currentLang: 'en' | 'bn' = 'en';

  constructor() {
    const browserLang = this.translateService.getBrowserLang();
    const initialLang: 'en' | 'bn' =
      browserLang && browserLang.startsWith('bn') ? 'bn' : 'en';
    this.currentLang = initialLang;
    this.translateService.use(this.currentLang);
  }

  setLanguage(lang: 'en' | 'bn'): void {
    if (this.currentLang === lang) {
      return;
    }
    this.currentLang = lang;
    this.translateService.use(lang);
  }

  handleLanguageSelectionChange(lang: 'en' | 'bn'): void {
    this.setLanguage(lang);
  }
}
