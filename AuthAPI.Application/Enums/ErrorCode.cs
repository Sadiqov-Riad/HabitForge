namespace AuthAPI.Application.Enums
{
        public enum ErrorCode
        {
            InvalidUsernameOrPassword,
            InvalidRefreshToken,
            RefreshTokenExpired,
            UserAlreadyExists,
            UnauthorizedAccess,
            PasswordsDoNotMatch,
            UserAlreadyExistsByEmail,
            EmailAndPasswordRequired
        }
}
