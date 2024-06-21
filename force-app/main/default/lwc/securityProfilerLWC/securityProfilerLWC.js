import { LightningElement, wire, track } from 'lwc';
import getAllProfiles from '@salesforce/apex/profilerLWCHelper.getAllProfiles';
import getProfileData from '@salesforce/apex/profilerLWCHelper.getProfileData';

export default class SecurityProfilerLWC extends LightningElement {     
        @track dataFromWire;
        @track ProfilesList; //Picklist options
        @track chosenProfile; //Selected item

        @wire(getAllProfiles, {})
        wiredProfileData({ error, data }) {
     
            if (data) {
                try {
                    this.dataFromWire = data; 
                    let options = []; // The options we're pulling in
                     
                    for (var key in data) {
                        //console.log('Profile Name' + data[key]); // Profile Name
                        //console.log('Profile ID' + key);
                        options.push({ label: data[key], value: key  }); // Build our list
                    }
                    this.ProfilesList = options;
                     
                } catch (error) {
                    console.error('ERROR: ', error);
                }
            } else if (error) {
                console.error('ERROR: ', error);
            }
     
        }
     
        handleChange(event){
            // When a profile is selected
            this.chosenProfile = event.detail.value; // Store Profile ID in chosenProfile
            //console.log('Chosen Profile Name' + event.target.options.find(opt => opt.value === event.detail.value).label); // Profile Name (no idea why this works)
        }

        handleClick(event){
            console.log("Chosen Profile ID: " + this.chosenProfile);
            getProfileData({myID: this.chosenProfile});
            //getProfileData('test').then(result => {}).catch(err => {}); // Run our profiler
        }
    }