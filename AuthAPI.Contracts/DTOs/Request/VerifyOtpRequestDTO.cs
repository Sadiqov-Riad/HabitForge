using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AuthAPI.Contracts.DTOs.Request
{
    public class VerifyOtpRequestDTO
    {
        public string UserId { get; set; }
        public string Otp { get; set; }
    }
}
