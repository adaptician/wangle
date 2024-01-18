using System.ComponentModel.DataAnnotations;

namespace Wangle.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}