namespace Habit.Infrastructure.HuggingFace;

public class HuggingFaceOptions
{
    public string ModelName { get; set; } = "Qwen/Qwen2.5-7B-Instruct";
    public string Endpoint { get; set; } = "https://router.huggingface.co/v1";
    public string? ApiKey { get; set; }
    public int TimeoutSeconds { get; set; } = 120;
    public double Temperature { get; set; } = 0.3;
    public int MaxNewTokens { get; set; } = 3000;
}

