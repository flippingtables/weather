import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import type { Weather } from "../../api/weatherdto.model";

@Component({
  selector: "app-weather-icon",
  standalone: true,
  imports: [MatCardModule],
  template: `<img
  mat-card-sm-image
  [src]="url"
  [alt]="weather().main"
/>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherIconComponent {
  weather = input.required<Weather>();

  get url() {
    return `https://openweathermap.org/img/wn/${this.weather().icon}@2x.png`;
  }
}
