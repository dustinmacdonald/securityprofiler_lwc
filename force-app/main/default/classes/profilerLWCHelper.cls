public with sharing class profilerLWCHelper {
    public profilerLWCHelper() {

    }

    @AuraEnabled(cacheable=true)
    public static Map<Id,String> getAllProfiles(){
            List<Profile> profiles = [SELECT Id, Name FROM Profile];
            Map<Id,String> objectMap = new Map<Id,String>();
            for(Profile listEntries : profiles){
                Id id = listEntries.Id;
                String label = listEntries.Name;
                objectMap.put(id,label);
           }
    return objectMap;
}

    @AuraEnabled()
    public static void getProfileData(Id myID) {
        System.debug('Profile ID from Apex: ' + myID);
        getObjectLevelSecurity(myID);
    }

    public static List<String> getObjectLevelSecurity(Id myID) {
        System.debug('getObjectLevelSecurity: ' + myID);
        //[SELECT Id, SObjectType, PermissionsRead, PermissionsCreate FROM ObjectPermissions WHERE parentid in (select Id from permissionset where PermissionSet.Profile.Name = 'System Administrator')]
    }
}