# Start Server

To start server run the following commands:
1. Build the files. `yarn build`
2. Run the compiled files. `yarn serve`


## API's

Make sure you have rest client extension on VScode for request.rest file to work and send requests. If you are going to use postman or thunderclient to hit the API endpoints just copy the body from the request.rest file. **Dont** Forget to change the authorization header accordingly.

## Environment Variables

Your `.env` file has the following already to get you started with immediately.

`PORT = 3000`
`DB_URL = "mongodb://0.0.0.0:27017/authapp"`
`JWT_SECRET = "40fcec6304b15d80ec82f99cb2b4cefcc5cd703299f1bfa10bd2bf1262725c2c"`
`EMAIL= ""`  Enter gmail password
`EMAIL_PASS = ""` Enter gmail password

> To use gmail account for the app: 
> 1. Go to: https://myaccount.google.com/apppasswords
> 2. On the  `Select app` dropdown select mail
> 3. Then `Select device`  according to what your running you app on
> 4. Update the environment variables accordingly and add the app password generated.

Video link for the above steps: 
https://www.youtube.com/watch?v=lBRnLXwjLw0&ab_channel=DailyTuition
>watch from timestamp 19:10