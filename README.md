![brachiosaurus](client/public/images/brachiosaurus-64.png?raw=true)

# _Fossil Jackets_ react-native phone app

This is an app to be used in field expeditions for recording metadata about
fossil jackets.  The app accepts all the usual data that would go on a
traditional field label.  It uses a phone’s GPS to obtain lat/lng coordinates
automatically, and grabs the time from the phone’s internal clock.

The app has two additional features not seen on a traditional label.  The app
can use the camera’s phone and/or gallery to store photos of the jacket,
specimen, and other features.  In order to be able to track jackets from the
field to the lab, the app can scan an RFID tag (with the tag to be embedded into
the plaster of the jacket itself).

### Components

* API server to collect data from the app and record it in a database
* The app itself
* A web client that displays a table of recorded jackets
* A PostgreSQL database to persist the data
* An nginx web head to serve the API and client

### Build instructions

TBD

### Icons credit

Thanks to [Freepik](https://www.freepik.com/) for the awesome
[dino icons](https://www.flaticon.com/packs/dinosaur-collection)!

Thanks to [Twitter emoji](https://twemoji.twitter.com/) for the clipboard, compass, and satellite emoji.
