using Habit.Application.Abstractions;
using Microsoft.Extensions.Options;
using System.Net.Http.Json;
using System.Text.Json;

namespace Habit.Infrastructure.Ollama;

public class OllamaClient : IOllamaClient
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly OllamaOptions _options;

    public OllamaClient(IHttpClientFactory httpClientFactory, IOptions<OllamaOptions> options)
    {
        _httpClientFactory = httpClientFactory;
        _options = options.Value;
    }

    public async Task<string> GenerateAsync(string prompt, CancellationToken ct = default)
    {
        var httpClient = _httpClientFactory.CreateClient();
        var timeoutSeconds = _options.TimeoutSeconds > 0 ? _options.TimeoutSeconds : 120;
        httpClient.Timeout = TimeSpan.FromSeconds(timeoutSeconds);

        var requestBody = new
        {
            model = _options.ModelName,
            prompt = prompt,
            stream = false,
            options = new
            {
                temperature = 0.7,
                top_p = 0.9,
                top_k = 50
            }
        };

        try
        {
            var response = await httpClient.PostAsJsonAsync($"{_options.BaseUrl}/api/generate", requestBody, ct);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
            return result.GetProperty("response").GetString() ?? "";
        }
        catch (HttpRequestException ex) when (ex.Message.Contains("connection", StringComparison.OrdinalIgnoreCase) ||
                                             ex.Message.Contains("refused", StringComparison.OrdinalIgnoreCase))
        {
            throw new Exception($"Ollama service is not available at {_options.BaseUrl}. Please ensure Ollama is running. Error: {ex.Message}");
        }
        catch (TaskCanceledException ex)
        {
            throw new Exception($"Ollama request timed out after {httpClient.Timeout.TotalSeconds:0}s. Please ensure Ollama is running and accessible at {_options.BaseUrl}. Error: {ex.Message}");
        }
    }
}



