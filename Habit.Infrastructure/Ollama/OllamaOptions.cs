namespace Habit.Infrastructure.Ollama;
public class OllamaOptions
{
    public string BaseUrl { get; set; } = "http://localhost:11434";
    public string ModelName { get; set; } = "gemma2:2b";
    public int TimeoutSeconds { get; set; } = 120;
}
