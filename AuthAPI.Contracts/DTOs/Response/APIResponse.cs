namespace AuthAPI.Contracts.DTOs.Response
{
    public class APIResponse<T>
    {
        public bool IsSuccess { get; }
        public string Message { get; }
        public int StatusCode { get; }
        public T? Data { get; }
        

        private APIResponse(bool isSuccess, string message, int statusCode, T? data) { 
            IsSuccess = isSuccess;
            Message = message;
            StatusCode = statusCode;
            Data = data;
        }

        public static APIResponse<T> Success(T? data = default, string message = "Success", int statusCode = 200)
        {
            return new APIResponse<T>(true, message, statusCode, data);
        }

        public static APIResponse<T> Error(string message = "Error", int statusCode = 400)
        {
            return new APIResponse<T>(false, message, statusCode, default);
        }
    }
}
