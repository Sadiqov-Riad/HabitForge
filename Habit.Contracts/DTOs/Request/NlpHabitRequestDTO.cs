using System.ComponentModel.DataAnnotations;
using Habit.Contracts.Validation;

namespace Habit.Contracts.DTOs.Request
{
    public class NlpHabitRequestDTO
    {
        [Required]
        [MaxLength(HabitFieldLimits.InputTextMax)]
        public string InputText { get; set; } = null!;
    }
}


