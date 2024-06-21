import { LightningElement, wire, track, api } from 'lwc';
import getNotes from '@salesforce/apex/homePageFilesController.getNotes';
import getURL from '@salesforce/apex/homePageFilesController.getURL';
import getCreatedDate from '@salesforce/apex/homePageFilesController.getCreatedDate';

// Columns for our files
const columns = [
    { label: 'Id', fieldName: 'Id', sortable:true},
    { label: 'File Name', fieldName: 'Title', type: 'text', sortable:true},
    { label: 'URL', fieldName: 'url', type: 'url', sortable:true},
    //{ label: 'Created Date', fieldName: 'CreatedDate', type: 'date' },
];

const values = []

export default class HomePageFilesLWC extends LightningElement {
    @track values;
    columns = columns;
    @track returnedURL = '';
    @track createdDateReturnedFromFunction;
    @track sortBy = 'Title';
    @track sortDirection = 'asc';
    @api folderName; // Populated by the parameter on the component

    @wire (getNotes, { folderName: '$folderName' }) wiredNotes({data,error}){
        if (data) {
            try {
                this.dataFromWire = data;
                let values = []; // Empty variable we'll be assembling
                 
                // Iterate through the file
                for (var key in data) {
                    let returnedURL = '';
                    
                    var constructedURL = getURL({ received: '$key'})
                    .then(result => {
                        constructedURL = result;
                    })
                    var createdDateReturnedFromFunction = getCreatedDate({ received: '$key'})
                    .then(result => {
                        createdDateReturnedFromFunction = result;
                    })
                    constructedURL = 'https://provisiopartners3-dev-ed.develop.lightning.force.com/lightning/r/ContentDocument/' + key + '/view';
                    values.push({ Id: key, Title: data[key], url: constructedURL}); // Test this line                    
                    //console.log('Created Date:' + data[createdDate]);
                    //values.push({ Id: key, Title: data[key], url: constructedURL});
                }
                this.values = values;
            } catch (error) {
                console.error('ERROR: ', error);
            }
        } else if (error) {
            console.error('ERROR: ', error);
        }

    }

    doSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.values));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        //this.values = [];
        this.values = parseData;
    }
}