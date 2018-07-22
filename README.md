# Notification Dropdown

A notification dropdown which gets random notifications from the server by **Push Mechanism** over Websocket.
I have used [socket.io](https://github.com/socketio/socket.io) library on the server side for sending push notifications to the client.


## Functionalities:-
- The backend keeps generating new notifications at random intervals in the database. 
- The server pushes the newly generated notification over websocket and the frontend receives it on the browser side. 
- The notification bell shows the number of new notifications available(not viewed by user) with a fadeIn effect. 
- Clicking on the bell displays the notification tab with a sliding motion and marks the notifications as viewed. 
- Clicking on a notification marks it as read and the state is saved on the server side as well. 
- On page refresh, all the available notifications at the backend are repopulated with correct state (read or unread and viewed and not viewed). 

## Requirements
- Node.js
- MySQL

### Table Structure
```
+--------+-----------------------------------------+--------+-----------+
| notiId | notiData                                | unread |    view   |
+--------+-----------------------------------------+--------+-----------+
|      1 | Mon Jul 16 2018 04:06:59 GMT+0530 (IST) |      1 |         1 |
|      2 | Mon Jul 16 2018 04:07:22 GMT+0530 (IST) |      1 |         0 |
|      3 | Mon Jul 16 2018 04:07:50 GMT+0530 (IST) |      0 |         1 |
+--------+-----------------------------------------+--------+-----------+

Incase of `unread`, 1 means unread and 0 means read.

Incase of `viewed`, 1 means not viewed and 0 means viewed.

```

## Setting Up
- Clone this repository.
- Open `server/constants.js`
   
     Configure the database username and password as shown below.

    ```
     /** database parameters */
     exports.DB_USER = "root";  // add Database username
     exports.DB_PASSWORD = "root";  // add Database password
     exports.DB_TABLE_NAME = "noti"; // don't change table name
     exports.DB_DATABASE_NAME = "notifications";  // don't change table name
    ```

- Inside `server/` directory run following command to install dependencies

      $ npm install

- Then start the server 

      $ node server.js

The server will start running at port 8000  and it does the following:-

1. It will generate random strings at random interval of time (between 5 to 10 secs)
2. It creates a random notification with that string and saves it to database.
3. It emits the 'notification' over websocket which is then received by the client and displayed(unread by default).

Now hit [http://localhost:8000](http://localhost:8000) and you should be good to go.

![screenshot from 2018-07-16 04-31-41](https://user-images.githubusercontent.com/18484641/42739253-8c09bca2-88b1-11e8-8aa2-3c4a14d2abe7.png)