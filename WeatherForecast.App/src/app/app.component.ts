import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ForecastComponent } from "./forecast/forecast.component";

@Component({
  selector: "app-root",
  standalone: true,
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  imports: [RouterOutlet, ForecastComponent]
})
export class AppComponent {
  title = "Weather";
}
