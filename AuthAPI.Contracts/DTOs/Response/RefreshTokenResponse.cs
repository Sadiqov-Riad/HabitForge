namespace AuthAPI.Contracts.DTOs.Response
{
    public class RefreshTokenResponse
    {
        public string AccessToken { get; }
        public string RefreshToken { get; }
        private RefreshTokenResponse(string accessToken, string refreshToken)
        {
            AccessToken = accessToken; 
            RefreshToken = refreshToken;
        }

        public static RefreshTokenResponse Create(string accessToken, string refreshToken)
        {
            return new RefreshTokenResponse(accessToken, refreshToken);
        }

    }
}
