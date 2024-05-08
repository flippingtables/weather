import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  TitleCasePipe
} from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { finalize, tap } from "rxjs";
import {
  WeatherService,
  type WeatherState,
  initialSate
} from "../api/weather.service";
import { untilDestroyed } from "../untilDestroyed";
import { WeatherIconComponent } from "./weather-icon/weather-icon.component";

@Component({
  selector: "app-forecast",
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatCardModule,
    TitleCasePipe,
    DatePipe,
    WeatherIconComponent
  ],
  templateUrl: "./forecast.component.html",
  styleUrl: "./forecast.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForecastComponent {
  #untilDestroyed = untilDestroyed();
  #weatherService = inject(WeatherService);
  #weather = this.#weatherService.GetWeather();
  state = signal<WeatherState>(initialSate);

  constructor() {
    this.#weather
      .pipe(
        tap({
          next: (fetchedData) => {
            if (fetchedData) {
              this.state.update((value) => ({
                loading: false,
                data: fetchedData,
                error: null
              }));
            }
          },
          error: (error) => {
            this.state.update((value) => ({
              loading: false,
              data: null,
              error: error
            }));
          }
        }),
        finalize(() => {
          this.state.update((value) => ({
            ...value,
            loading: false
          }));
        }),
        this.#untilDestroyed()
      )
      .subscribe();
  }

  getIconUrl() {
    return `https://openweathermap.org/img/wn/${
      this.state()?.data?.weather[0].icon
    }@2x.png`;
  }
}
