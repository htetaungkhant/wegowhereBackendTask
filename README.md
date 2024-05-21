# wegowhereBackendTask

I approached the solution of [this question](https://wegowhere.notion.site/Full-Stack-Task-e71d0a28cef944d8b46723623dabaa81) by using microservice strategy.

So, the key requirements include:
- **Real-Time Communication:** facilitate instant messaging between users, ensuring a seamless real-time experience.
- **Scalability:** support easy scaling of individual components to accommodate a growing user base without affecting the entire system.
- **Modularity:**  allow to update, deploy, and scale each microservice independently.

## Technologies and tools
- **nodejs( Expressjs )** for Backend Services
- **TypeScript** for Enhanced Development
- **Socket.io** for Real-Time Communication
- **RabbitMQ** for Incorporate a message queue system and to handle message delivery
- **FCM( Firebase Cloud Messaging )** for real-time push notification delivery to mobile devices ( only when the users are online )
- **nodemailer** to send email notification ( When the users are offline, don't delivery push notification to mobile devices. )
- **Docker** for Containerization
- **MongoDB** for Data Storage
- **Nginx** as a Reverse Proxy

## Prerequisites
    1. Docker and docker-compose

## Start the project
-  Create a `.env` files from each microservice folder based on the provided `.env.example` files and fill in the necessary configuration details.
- Run `docker-compose up --build` from the project root directory to start the application in a containerized environment.

That's all. Then you can access the prject at [http://localhost:85](http://localhost:85). 

## Configuration
For `MESSAGE_BROKER_URL` environment variable, please create or login account at [CloudAMQP](https://www.cloudamqp.com/). Then you can get the `URL` at the ***AMQP details*** section of the console after you have logged in.

For `SENDINBLUE_APIKEY`, `SMTP_USER` and `SMTP_PASS` environment variables, please create or login account at [brevo](https://www.brevo.com/). And then you can those data the ***SMTP & API*** section of the setting after you have logged in.

## Testing and debugging
Please use postman to test API services.

**1. Microservice Verification:**  Confirm that each microservice is up and running. The user service should be accessible at [http://localhost:8081](http://localhost:8081), the chat service at [http://localhost:8082](http://localhost:8082/), and the notification service at [http://localhost:8083](http://localhost:8083/).

**2. User Registration and Authentication:** Register a new user by sending a `POST` request to http://localhost:8080/user/register with the following JSON data:
```sh
{
    "name": "Test User",
    "email": "{{REAL_EMAIL_ADDRESS}}",
    "password": "password"
}
```
Replace `REAL_EMAIL_ADDRESS` with a valid email address (we’ll need this to send emails). Upon successful registration, proceed to log in by sending a `POST` request to [http://localhost:8080/user/login](http://localhost:8080/user/login) with the registered email and password.

**3. Message Sending:** Test the message-sending functionality by making a `POST` request to [http://localhost:8080/chat/send](http://localhost:8080/chat/send) with the following JSON data:
```sh
{
    "receiverId": "{{RECEIVER_ID}}",
    "message": "Hello there!"
}
```
Replace `RECEIVER_ID` with the ID of another registered user obtained from the registration response. Upon sending the message, an email notification will be dispatched to the recipient's email address.

**4. Getting conversation:** Retrieve the whole conversation messages by making a `GET` request to [http://localhost:85/chat/get/:receiverId](http://localhost:85/chat/get/:receiverId). Replace `:receiverId` with the ID of  registered user obtained from the registration response.

> For the real-time push notification services, you can test by using your mobile devices.

## Explanation about Setup of the Microservices
### User Service
A fundamental component of microservices architecture. The User Service is responsible for handling user registration, authentication, and the storage of user-related data in MongoDB.
### Chat Service
The Chat Service enables real-time communication between users, fostering a dynamic and interactive user experience within application. I'll structure the project, set up dependencies, and create the necessary files and folders to establish a robust foundation for building the Chat Service.
### Notification Service
Real-time notifications for chat application. Notifications play a crucial role in keeping users informed about new messages, ensuring timely communication, and providing a seamless chatting experience.
### API Gateway
This will connect all our microservices ports to one gateway.
### Nginx Configuration
Nginx as a reverse proxy to route requests to the appropriate microservices based on the URL path. Each microservice is defined as an upstream server, and Nginx listens on port `85` for incoming requests. Requests to `/user/`, `/chat/`, and `/notification/` are proxied to the respective microservices running on ports `8081`, `8082`, and `8083`.


