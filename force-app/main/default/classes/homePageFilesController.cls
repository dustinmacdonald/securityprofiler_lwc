public with sharing class homePageFilesController {
    public homePageFilesController() {

    }

@AuraEnabled(cacheable=true)
public static Map<Id,String> getNotes(String folderName){
    // get the Release Notes folder
    System.debug(folderName);

    ContentWorkspace workspace = [Select Id, Name FROM ContentWorkspace WHERE Name = :folderName LIMIT 1];
    System.debug('workspace ID = ' + workspace.Id);
    ContentFolder folder = [Select Id, Name FROM ContentFolder WHERE Name = :workspace.Id];
    System.debug('folder name ID = ' + folder.Name);
    // get the Release Notes folder members, each one has a ContentDocumentID we want
    List<ContentFolderMember> folder_members = [Select ChildRecordId, ParentContentFolderId FROM ContentFolderMember WHERE ParentContentFolderId =: folder.Id];
    
    // Build a list of IDs by iterating through the folder
    List<Id> listOfDocuments = New List<Id>();
    for(ContentFolderMember listEntries : folder_members){
        Id fileId = listEntries.ChildRecordId;
        listOfDocuments.add(fileId);
   }

    // Get our list of files
    List<ContentDocument> files = [SELECT Id, Title, CreatedDate FROM ContentDocument WHERE Id IN :listOfDocuments];
    
    // Build our map that we are returning to the LWC component 
    Map<Id,String> objectMap = new Map<Id,String>();
    for(ContentDocument listEntries : files){
        Id id = listEntries.Id;
        String label = listEntries.Title;
        //Datetime crDate = listEntries.CreatedDate;
        System.debug('Created Date:' + listEntries.CreatedDate);
        objectMap.put(id,label);
   }
return objectMap;
}

@AuraEnabled(cacheable=true)
public static String getURL(String received){
    // Create our URL by using the org URL plus the file ID
    String constructedURL = URL.getOrgDomainURL().toExternalForm() + received + '/view';
    return constructedURL;
   }
   
   @AuraEnabled(cacheable=true)
   public static Datetime getCreatedDate(Id givenId){
    ContentDocument myFile = [SELECT CreatedDate FROM ContentDocument WHERE Id =: givenId];
    return myFile.CreatedDate;
   }
}