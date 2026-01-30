using AuthAPI.Application.Enums;

namespace AuthAPI.Application.Constants
{
    public class ErrorDetail
    {
        public string Message { get; }
        public int StatusCode { get; }

        public ErrorDetail(string message, int statusCode)
        {
            Message = message;
            StatusCode = statusCode;
        }
    }

    namespace AuthAPI.Application.Enums
    {
        public static class ErrorCodeExtensions
        {
            public static ErrorDetail GetErrorDetail(this ErrorCode code)
            {
                var (message, status) = code switch
                {
                    ErrorCode.InvalidUsernameOrPassword => ("Invalid username or password", 401),
                    ErrorCode.InvalidRefreshToken => ("Invalid refresh token", 401),
                    ErrorCode.RefreshTokenExpired => ("Refresh token expired", 401),
                    ErrorCode.UserAlreadyExists => ("User already exists", 409),
                    ErrorCode.UnauthorizedAccess => ("Unauthorized access", 403),
                    ErrorCode.PasswordsDoNotMatch => ("Passwords do not match", 400),
                    ErrorCode.UserAlreadyExistsByEmail => ("User with this email already exists", 409),
                    ErrorCode.EmailAndPasswordRequired => ("Email and password are required", 400),
                    _ => ("Unknown error", 500)
                };

                return new ErrorDetail(message, status);
            }
        }
    }

}
