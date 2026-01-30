using AuthAPI.Infrastructure.Settings;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

public class EmailSender
{
    private readonly EmailSettings _settings;

    public EmailSender(IOptions<EmailSettings> settings)
    {
        _settings = settings.Value;
    }

    public async Task SendEmailAsync(string email, string subject, string htmlBody)
    {
        using var message = new MailMessage
        {
            From = new MailAddress(_settings.From),
            Subject = subject,
            Body = htmlBody,
            IsBodyHtml = true
        };
        message.To.Add(email);

        using var smtp = new SmtpClient(_settings.Host, _settings.Port)
        {
            Credentials = new NetworkCredential(_settings.Username, _settings.Password),
            EnableSsl = true
        };

        await smtp.SendMailAsync(message);
    }
}
