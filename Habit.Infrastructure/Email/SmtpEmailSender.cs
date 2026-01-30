using System.Net;
using System.Net.Mail;
using System.Text;
using Habit.Application.Interfaces;
using Microsoft.Extensions.Options;

namespace Habit.Infrastructure.Email;
public sealed class SmtpEmailSender : IEmailSender
{
    private readonly SmtpEmailOptions _options;
    public SmtpEmailSender(IOptions<SmtpEmailOptions> options)
    {
        _options = options.Value;
    }

    public async Task SendAsync(string toEmail, string subject, string body, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(_options.Host) || string.IsNullOrWhiteSpace(_options.From))
        {
            return;
        }

        if (!string.IsNullOrWhiteSpace(_options.Username))
        {
            if (string.IsNullOrWhiteSpace(_options.Password) || _options.Password.StartsWith("REPLACE_", StringComparison.OrdinalIgnoreCase))
            {
                throw new Exception("SMTP password is not configured. Set Email:Password (or env var Email__Password) to a real SMTP/app password.");
            }
        }

        using var message = new MailMessage
        {
            From = new MailAddress(_options.From, _options.FromName),
            Subject = subject,
            Body = body,
            IsBodyHtml = true,
        };
        message.SubjectEncoding = Encoding.UTF8;
        message.BodyEncoding = Encoding.UTF8;
        message.To.Add(new MailAddress(toEmail));
        using var client = new SmtpClient(_options.Host, _options.Port)
        {
            EnableSsl = _options.EnableSsl,
        };
        if (!string.IsNullOrWhiteSpace(_options.Username))
        {
            client.Credentials = new NetworkCredential(_options.Username, _options.Password);
        }

        await client.SendMailAsync(message);
    }
}
