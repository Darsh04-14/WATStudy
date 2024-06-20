# WATStudy

WATStudy is an application designed to help students at the University of Waterloo connect and study together on campus. By enabling students to select study rooms and meet up to study in groups, WATStudy aims to create a collaborative and supportive learning environment.

## Working Features

-   **Search Filter**: Queries based on column constraints in the request to return all valid sessions from the table
-   **Create Postings**: Insert a row into the table with column values provided in the request
-   **Delete Postings**: Allows a user who created a posting to delete it
-   **Reminder Email**: Allows a user to send a notification email to all users signed up for a study session with all the necessary details about the event

## Setup
If you want to access the database, please reach out to us for the `.env` file because the database is stored on the Google Cloud SQL Server. Place it in the `server` folder and then run the `npm` commands below. There is no need to create and load the database because it is hosted on the cloud.

1. Clone the repo:
   `git clone https://github.com/Darsh04-14/WATStudy.git`
2. Install the dependencies:
   `npm install`
3. Run the server:
   `npm run server`
4. Run the client:
   `npm run client`
