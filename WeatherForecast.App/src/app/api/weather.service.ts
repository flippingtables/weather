import { HttpClient, type HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import type { WeatherDTO } from "./weatherdto.model";

export interface WeatherState {
  loading: boolean;
  error: Error | null;
  data: WeatherDTO | null;
}
export const initialSate: WeatherState = {
  loading: true,
  error: null,
  data: null
};
@Injectable({
  providedIn: "root"
})
export class WeatherService {
  #api = "http://localhost:5086/api/weatherforecast/weather";
  #httpClient = inject(HttpClient);

  public GetWeather() {
    return this.#httpClient
      .get<WeatherDTO>(this.#api)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error("An error occurred:", error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }

    return throwError(
      () =>
        new Error(
          "Weather unavailable. Consider looking out the window to see if its still there."
        )
    );
  }
}
