using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using WeatherForecast.Dtos;

namespace WeatherForecast.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static string API_RESOURCE (string lat, string lon, string api) => $"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={api}";

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        public readonly IConfiguration _configuration;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _logger = logger;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        [HttpGet("weather")]
        public async Task<WeatherDTO> GetOst()
        {
            var api_key = _configuration.GetValue<string>("API_KEY");

            // Getinge sweden
            var resource = API_RESOURCE("56.8200323", "12.7248984", api_key!);
            
            var useMock = _configuration.GetValue<bool>("UseMock");

            if (useMock)
            {
                return ReadMockData();
            }

            using HttpClient client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync(resource!);

            response.EnsureSuccessStatusCode();
            
            var weather = await response.Content.ReadFromJsonAsync<WeatherDTO>();
            
            return weather!;

        }

        private static WeatherDTO ReadMockData()
        {
            using (StreamReader r = new StreamReader("MockData/MockWeatherData.json"))
            {
                string json = r.ReadToEnd();
                var data = JsonSerializer.Deserialize<WeatherDTO>(json);
                return data!;
            }


        }
    }
}
