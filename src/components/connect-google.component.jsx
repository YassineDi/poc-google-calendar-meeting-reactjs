import React from 'react';
import {API_KEY} from "../config/google-config";
import data from "./../data/secret-google";
const gapi=window.gapi;
const event = {
    'summary': 'Awesome Event!',
    'location': 'AGADEV, Skooltool',
    'description': 'Test event',
    'start': {
        'dateTime': '2021-02-18T09:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
    },
    'end': {
        'dateTime': '2021-02-18T17:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
    },
    'recurrence': [
        'RRULE:FREQ=DAILY;COUNT=2'
    ],
    'attendees': [
        {'email': 'dibiyassine@gmail.com'},
        {'email': 'yassine.dibi@agadev.io'}
    ],
    'reminders': {
        'useDefault': false,
        'overrides': [
            {'method': 'email', 'minutes': 24 * 60},
            {'method': 'popup', 'minutes': 10}
        ]
    },
    'conferenceData':{
        "entryPoints": [
            {
                "entryPointType": "video",
                "uri": "https://meet.google.com/ibk-zieg-hre",
                "label": "meet.google.com/ibk-zieg-hre"
            },
            {
                "entryPointType": "more",
                "uri": "https://tel.meet/wix-pvpt-njj?pin=000000",
                "pin": "000000"
            },
            {
                "entryPointType": "phone",
                "uri": "tel:+212-6-3869-7614",
                "label": "+212 6 3869 7614",
                "pin": "000000"
            }
        ],
        "createRequest":{
            "conferenceSolutionKey": {
                "type": "hangoutsMeet"
            },
            'requestId': "ibk-zieg-hre",
            "status": {
                "statusCode": "pending"
            }
        },
        "conferenceSolution":{
            "key":{
                "type":"hangoutsMeet"
            },
            "name": "Hangouts Meet",
            "iconUri": "https://lh5.googleusercontent.com/proxy/bWvYBOb7O03a7HK5iKNEAPoUNPEXH1CHZjuOkiqxHx8OtyVn9sZ6Ktl8hfqBNQUUbCDg6T2unnsHx7RSkCyhrKgHcdoosAW8POQJm_ZEvZU9ZfAE7mZIBGr_tDlF8Z_rSzXcjTffVXg3M46v",
        },
    }
};
export default class ConnectGoogleComponent extends React.Component {


    constructor(props) {
        super(props);
        this.state={
            events: [],
            uriMetting:"#"
        }
        this.getEvents=this.getEvents.bind(this);
        this.handleClick = this.handleClick.bind(this);

    }

    getEvents() {
        var CLIENT_ID = data.web.client_id;
        var API_KEY = API_KEY;
        var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
        var SCOPES = "https://www.googleapis.com/auth/calendar.events";
        gapi.load('client:auth2', () => {
            console.log('loaded client');
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            })

            gapi.client.load('calendar', 'v3', () => console.log('bam!'))
            gapi.auth2.getAuthInstance().signIn()
                .then(() => {
                    this.createButtonGoogleMeet(event);
                    gapi.client.calendar.events.insert({
                        'calendarId': 'primary',
                        'resource': event,
                        "conferenceDataVersion":1,
                        'sendNotifications': true,
                    }).execute(event => {
                        console.log(event)
                        window.open(event.htmlLink)
                    })


                })

        })
    }
    createButtonGoogleMeet=(event)=>{
        var solution = event.conferenceData.conferenceSolution;
        var uriMetting=event.conferenceData.entryPoints[0].uri;
        var content = document.getElementById("content");
        content.style.display="block";
        var text = document.createTextNode("Join " + solution.name);
        var icon = document.createElement("img");
        icon.src = solution.iconUri;
        content.appendChild(icon);
        content.appendChild(text);
        this.setState({
            uriMetting
        });
    }

    handleClick=(e)=>{
        this.getEvents();
    }

    render() {
        return (
            <>
                <button onClick={this.handleClick} >Click me ! </button>
                <a href="#" onClick={()=>{window.open(this.state.uriMetting)}} id="content"></a>
            </>
        );
    }
}
