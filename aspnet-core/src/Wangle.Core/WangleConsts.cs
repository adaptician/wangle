using Wangle.Debugging;

namespace Wangle
{
    public class WangleConsts
    {
        public const string LocalizationSourceName = "Wangle";

        public const string ConnectionStringName = "Default";

        public const bool MultiTenancyEnabled = true;


        /// <summary>
        /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
        /// </summary>
        public static readonly string DefaultPassPhrase =
            DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "3ed06c27362e44028652ecb110c971b3";
    }
}
