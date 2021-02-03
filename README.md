# Strava Gear Tracker

## About

An app to track the usage of bike components. 

Each component can be linked to particular Strava bike(s). Whenever a new activity is created on Strava for specific bike, the app will update the bike's components mileage/usage time.

It is also possible to set up distance/time goal for each component.

## Usage

Live version [here](http://stravageartracker.herokuapp.com/).

In order to use the app you need to have a Strava account (Strava is a website for tracking your sport activity.) It is really [easy and free](https://www.strava.com/) to set up.

## How does it work? 

Users are authenticated to Strava via OAuth. 

Bike data is pulled from Strava API.

Mileage/time updates to the gear are possible due to [Strava webhook API subscription](https://developers.strava.com/docs/webhooks/).

## Technology stack

Backend: Python & Django, Django Rest Framework

Frontend: TypeScript & React hooks

## Screenshot:
![Alt text](/screenshots/GearTrackerIndex.PNG?raw=true)
