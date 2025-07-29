namespace Wangle.Authorization
{
    public static class PermissionNames
    {
        public const string Pages_Tenants = "Pages.Tenants";

        public const string Pages_Users = "Pages.Users";
        public const string Pages_Users_Activation = "Pages.Users.Activation";

        public const string Pages_Roles = "Pages.Roles";
        
        // SIMULATIONS
        public const string Pages_Simulations = "Pages.Simulations";
        public const string Pages_Simulations_View = "Pages.Simulations.View";
        
        // CONTROL
        public const string Pages_Simulations_Control = "Pages.Simulations.Control";
        public const string Pages_Simulations_Control_Request = "Pages.Simulations.Control.Request";
        public const string Pages_Simulations_Control_Assume = "Pages.Simulations.Control.Assume";
        public const string Pages_Simulations_Control_Interact = "Pages.Simulations.Control.Interact";
        
        // MEDIATE
        public const string Pages_Simulations_Mediate = "Pages.Simulations.Mediate";
        public const string Pages_Simulations_Mediate_View = "Pages.Simulations.Mediate.View";
        public const string Pages_Simulations_Mediate_Participant_Grant = "Pages.Simulations.Mediate.Participant.Grant";
        public const string Pages_Simulations_Mediate_Participant_Evict = "Pages.Simulations.Mediate.Participant.Evict";
    }
}
