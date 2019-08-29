# Hotel Booking System

This web server provides a simple implementation of a hotel booking system.
Please find below list of operations supported by the three resources (User, Rooms, Bookings):

## Table of Contents

-   [Users](#users)
-   [Rooms](#rooms)
-   [Bookings](#bookings)

## Users

| URI                 |  HTTP  | Body | Description                |
| :------------------ | :----: | :--: | :------------------------- |
| /users              |   GET  |   -  | List of all users          |
| /users/:id          |   GET  |   -  | Details of a user          |
| /users              |  POST  | JSON | Adds a new user            |
| /users/:id          |   PUT  | JSON | Updates a user             |
| /users/:id          | DELETE |   -  | Deletes a user             |
| /users/:id/bookings |   GET  |   -  | Get all bookings of a user |

```javascript
{
    "id": integer,
    "first_name": string,
    "last_name": string,
    "username": string,
    "email": string,
    "password": string,
    "bonus_points": float,
    "bookings": [Booking, Booking,...]
}
```

## Rooms

| URI                   |  HTTP  | Body | Description                                     |
| :-------------------- | :----: | :--: | :---------------------------------------------- |
| /rooms                |   GET  |   -  | List of all rooms                               |
| /rooms/:id            |   GET  |   -  | Details of a room                               |
| /rooms                |  POST  | JSON | Add a new hotel room                            |
| /rooms                |   PUT  | JSON | Update a hotel room                             |
| /rooms/:id            | DELETE |   -  | Delete a hotel room                             |

```javascript
{
    "id": integer,
    "room_no": string,
    "description": string,
    "size": integer,
    "capacity": integer,
    "price": float
}
```

## Bookings

| URI                 |  HTTP  | Body | Description                          |
| :------------------ | :----: | :--: | :----------------------------------- |
| /bookings           |   GET  |   -  | List of all bookings                 |
| /bookings/:id       |   GET  |   -  | Details of a booking                 |
| /bookings           |  POST  | JSON | Add a new booking                    |
| /bookings/:id       | DELETE |   -  | Delete a booking                     |
| /bookings/:id/rooms |   GET  |   -  | List of all rooms of a booking       |

```javascript
{
    "id": integer,
    "date": date,
    "arrival_date": date,
    "departure_date": date,
    "payment_method": string,
    "amount": float,
    "user": User,
    "rooms": [Room, Room,...],
    "booking_status": string
}
```

## How to use

-   Run 'npm install' at root level of the project, to install all required dependencies.
-   Setup mongodb on local machine, create database called 'hotel' and three collections 'bookings', 'users' and 'rooms'.
-   Traverse in cmd to directory */hotel-booking-system/data/seedData/*, and run the command 'node deploy.js' to create test data.
-   To start the server go to the root level of the project and run 'npm start'.
-   Follow the above APIs to make perform CRUD operations on the resources.

## Notes and Sample

- There are four different types of payment methods for a booking. Valid values are ['paytm', 'credit', 'debit', 'cash', 'bonus']
- config.json has various configuration items like, host, namespace, mongo(host, port), useMongo
- A sample Booking request looks like the following using bonus payment method:
    URL: **http://localhost:3000/api/v1/bookings**
    Method: POST
    Body:
    ```javascript
    {
        "date": "2019-08-29T06:09:13.104Z",
        "arrival_date": "2019-09-05T06:09:13.104Z",
        "departure_date": "2019-09-05T06:09:13.104Z",
        "payment_method": "bonus",
        "amount": 74.95,
        "user": "3"
    }
    ```
    Response:
    ```javascript
    {
        "date": "2019-08-29T06:09:13.104Z",
        "arrival_date": "2019-09-05T06:09:13.104Z",
        "departure_date": "2019-09-05T06:09:13.104Z",
        "payment_method": "bonus",
        "amount": 74.95,
        "user": "/api/v1/users/3",
        "rooms": [
            "/api/v1/rooms/8"
        ],
        "booking_status": "BOOKED",
        "id": "/api/v1/bookings/9"
    }
    ```
    If user bonus balance is less than booking amount then booking status displays 'PENDING APPROVAL'.

- A sample bonus points update request for a user looks like the following:
    URL: **http://localhost:3000/api/v1/users/<id>**
    Method: PUT
    Body:
    ```javascript
    {
        "bonus_points": 500.50
    }
    ```
    Response:
    ```javascript
        {
            "id": "/api/v1/users/1",
            "first_name": "Negan",
            "last_name": "",
            "username": "negan",
            "email": "negan@email.com",
            "password": "lucille",
            "bookings": [
                "/api/v1/bookings/1"
            ],
            "bonus_points": 600.50
        }
    ```

- A sample use scenario:
    Let's assume seedData creates the following:
    - 3 users.
    - 3 bookings for 9 rooms.
    - 10 rooms.

    1st user has the following attributes:
    ```javascript
        {
            "id": "/api/v1/users/1",
            "first_name": "Negan",
            "last_name": "",
            "username": "negan",
            "email": "negan@email.com",
            "password": "lucille",
            "bookings": [
                "/api/v1/bookings/1"
            ],
            "bonus_points": 600.50
        }
    ```

    Now if we attempt to create a booking for user 1 with the following attributes, room amount exceeding available bonus points:
    ```javascript
        {
            "date": "2019-08-25T12:01:04.740Z",
            "arrival_date": "2019-08-31T12:01:04.740Z",
            "departure_date": "2019-09-09T12:01:04.740Z",
            "payment_method": "bonus",
            "amount": 1000.02,
            "user": "1"
        }
    ```
    This changes the booking_status of the newly created booking to 'PENDING APPROVAL'.

    Let's assume another user (2) tries to create a booking, in this scenario if user has proper payment method and credit available the booking with 'PENDING APPROVAL' gets deleted and the booking for user 2 gets created with status 'BOOKED'. If payment method is not valid, error message .gets displayed stating that rooms are unavailable.
    ```javascript
        {
            "date": "2019-08-25T12:01:04.740Z",
            "arrival_date": "2019-08-31T12:01:04.740Z",
            "departure_date": "2019-09-09T12:01:04.740Z",
            "payment_method": "cash",
            "amount": 1000.02,
            "user": "2"
        }
    ```

    In case all bookings are present in 'BOOKED' state, all new bookings will not be accepted, and proper error message gets displayed to the user.

**Happy Coding!**