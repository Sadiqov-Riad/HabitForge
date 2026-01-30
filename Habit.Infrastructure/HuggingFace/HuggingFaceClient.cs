using Habit.Application.Abstractions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace Habit.Infrastructure.HuggingFace;
public class HuggingFaceClient : IOllamaClient
{
    private readonly HttpClient _httpClient;
    private readonly HuggingFaceOptions _options;
    private readonly ILogger<HuggingFaceClient>? _logger;
    public HuggingFaceClient(IHttpClientFactory httpClientFactory, IOptions<HuggingFaceOptions> options, ILogger<HuggingFaceClient>? logger = null)
    {
        _httpClient = httpClientFactory.CreateClient();
        _options = options.Value;
        _logger = logger;
        if (string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            throw new InvalidOperationException("HuggingFace ApiKey is not configured");
        }

        if (string.IsNullOrWhiteSpace(_options.ModelName))
        {
            throw new InvalidOperationException("HuggingFace ModelName is not configured");
        }

        _httpClient.Timeout = TimeSpan.FromSeconds(_options.TimeoutSeconds > 0 ? _options.TimeoutSeconds : 120);
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _options.ApiKey);
        _logger?.LogInformation("HuggingFace Client initialized with model: {ModelName}, endpoint: {Endpoint}", _options.ModelName, _options.Endpoint);
    }

    public async Task<string> GenerateAsync(string prompt, CancellationToken ct = default)
    {
        _logger?.LogInformation("HuggingFace API request, model: {ModelName}, prompt length: {PromptLength}", _options.ModelName, prompt?.Length ?? 0);
        var apiUrl = $"{_options.Endpoint.TrimEnd('/')}/chat/completions";
        var requestBody = new
        {
            model = _options.ModelName,
            messages = new[]
            {
                new
                {
                    role = "user",
                    content = prompt
                }
            },
            temperature = _options.Temperature > 0 ? _options.Temperature : 0.3,
            max_tokens = _options.MaxNewTokens > 0 ? _options.MaxNewTokens : 300
        };
        try
        {
            _logger?.LogInformation("Sending request to HuggingFace OpenAI-compatible endpoint: {Url}", apiUrl);
            using var response = await _httpClient.PostAsJsonAsync(apiUrl, requestBody, ct);
            string? body = await response.Content.ReadAsStringAsync(ct);
            _logger?.LogInformation("HuggingFace API response status: {StatusCode}, body length: {BodyLength}", response.StatusCode, body?.Length ?? 0);
            if (!response.IsSuccessStatusCode)
            {
                _logger?.LogError("HuggingFace API error: {StatusCode}, {Body}", response.StatusCode, body);
                throw new Exception($"HuggingFace API error ({response.StatusCode}): {body}");
            }

            try
            {
                var result = JsonSerializer.Deserialize<JsonElement>(body ?? string.Empty);
                if (result.TryGetProperty("choices", out var choices) && choices.ValueKind == JsonValueKind.Array && choices.GetArrayLength() > 0)
                {
                    var firstChoice = choices[0];
                    if (firstChoice.TryGetProperty("message", out var message) && message.TryGetProperty("content", out var content))
                    {
                        var responseText = content.GetString() ?? string.Empty;
                        _logger?.LogInformation("Successfully extracted response, length: {Length}, preview: {Preview}", responseText.Length, responseText.Length > 200 ? responseText.Substring(0, 200) + "..." : responseText);
                        return responseText;
                    }

                    _logger?.LogWarning("Response has choices but no message.content. Full response: {Body}", body);
                }
                else
                {
                    _logger?.LogWarning("Response has no choices array or it's empty. Full response: {Body}", body);
                }
            }
            catch (JsonException jsonEx)
            {
                _logger?.LogError(jsonEx, "Failed to parse HuggingFace response as JSON. Body: {Body}", body);
            }

            _logger?.LogWarning("Unexpected response format. Full response: {Body}", body);
            return body ?? string.Empty;
        }
        catch (HttpRequestException httpEx)
        {
            _logger?.LogError(httpEx, "HTTP request failed to HuggingFace API");
            throw new Exception($"HuggingFace API request failed: {httpEx.Message}", httpEx);
        }
        catch (TaskCanceledException timeoutEx)
        {
            _logger?.LogError(timeoutEx, "HuggingFace API request timed out");
            throw new Exception($"HuggingFace API request timed out after {_httpClient.Timeout.TotalSeconds}s", timeoutEx);
        }
        catch (Exception ex)
        {
            _logger?.LogError(ex, "Error calling HuggingFace API");
            throw new Exception($"HuggingFace API request failed: {ex.Message}", ex);
        }
    }
}
