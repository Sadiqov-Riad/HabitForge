using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AuthAPI.Application.Services.Utils
{
    public static class OTPGenerator
    {
        public static string GenerateOtp(int length = 6)
        {
            var random = new Random();
            string otp = "";
            for (int i = 0; i < length; i++)
                otp += random.Next(0, 10).ToString();
            return otp;
        }
    }
}
