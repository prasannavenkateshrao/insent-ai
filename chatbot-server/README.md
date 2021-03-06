# Chatbot-server
This app is built by P Prasanna from scratch with Nodejs Express framework.

## To run the app locally in your system you will need NodeJS version 16.13.0 and NPM 8.1.0 as lower versions below these may throw errors:
Navigate to the project folder in your terminal:

`npm install` would install all the dependencies and `npm  run dev` would start a local dev server at http://localhost:8000/. The app would automatically reload if you change any of the source files

Architecture design:

This app provides set of microservices API endpoints to front end JS app for loading a custom configured bot from Insent.ai administrative panel

The API's created are custom made and aggregared mainly for smooth loading of consuming front end Angular app. These API's in turn consume insent.ai exposed API's for loading
information like user, authentication, channel and also triggers conversation API's exposed.

Overall this Node JS set of services created along with separate front end Angular based component forms a micro app architecture of services and front end tied together yet
deployed separately hence implementing microservices architecture.

Angular front end application will call these exposed API's only in the below order, 

1) /get/chat-bot -> gives required user, bot and channel data for the bot to appear on page with welcome message configured
2) /retrieve/chat-bot/data -> gives information for loading the first element of the bot configured in insent.ai console and also authentication details for it to 
initiate web socket communication to continue the conversation further data to server based on user interaction
3) /update/user/conversation?operation=deliver/read/spentTime -> these endpoints allow front end app to call Read, Deliver and spentTime API's exposed by insent.ai to intimate the conversations happening
from front end. 

All front end app needs to do is call this 3rd API with query param named "operation" to differentiate which API to trigger. Values configured for this param are deliver, read and spentTime.

Operation spentTime alone will need further more information like eventType, timestamp, field and timeSpent fields needing to be passed from
the angular app. Angular app just needs to attach event listener to the form and can trigger this spentTime node API when conversation happens
between user and the app. 

This Node JS microservice makes Angular JS app lightweight by just consuming this information and displaying it as needed and also posting back the conversation. Only
implementation Angular app needs to make is to implement the pusher exposed websocket implementation of insent.ai to continue the conversation between server and get
further conversations that needs to be loaded. 
