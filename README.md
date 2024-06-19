# Convo
Convo is a social media web app designed to connect people through seamless interactions and a user-friendly interface. The aim was to maintain reactivity and a clean, minimal aesthetic while providing a wide feature set.

## Technologies Used
* React and Chakra UI for the frontend.
* Django and Postgres for the backend.
* Django Rest Framework was used to roll up most of the API and auth.
* Django Channels and the browser Websocket API to enable real-time messaging communication
  
## Features
* Users can create profiles and update their profile pictures.
* Users can share images, and like and comment on others images.
* Users can search for other users, view their statistics and posts.
* Users can message other users in real-time. 
* Users can follow others to see their posts in their feed.

## Setup and Usage

Clone the repository and navigate into the directory.
  
  ```
  git clone git@github.com:abi-sheks/convo.git
  cd convo
  ```
### Frontend
Navigate to the frontend directory and install all dependencies. npm is required to run the frontend.

  ```
  cd frontend
  npm install
  ```
Run the development server on http://localhost:3000

  ```
  npm start
  ```

### Backend

python and pip are required to further run the backend
Navigate to the backend directory, create a virtual environment and activate it. (Note : ```python3``` invokes the interpreter on Linux systems, commmand may be different for Windows)
(Install the venv package if you don't have it using ```pip install```

```
cd backend
python3 -m venv <venv-name>
source ./<venv-name>/bin/activate
```

(Source is being used assuming a Unix system, on Windows, the ```bin``` directory will contain a activate.bat file to be run.)

Install the dependencies for the project using the requirements.txt

```
pip install -r requirements.txt
```

Setup the .env file in the backend directory using the .env.example. Local postgres database should do, but a cloud provider like [Aiven](https://aiven.io) or [Render](https://render.com/) is recommended.

After setting up the .env file, run the necessary migrations and create a superuser

```
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser
```

Run the server on http://localhost:8000

```
python3 manage.py runserver
```