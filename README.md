<img width="1212" alt="image" src="https://github.com/Darsh04-14/WATStudy/assets/85283195/719b57e0-26e2-458f-8915-23aeb79e749b">

# WATStudy

WATStudy is an application designed to help students at the University of Waterloo connect and study together on campus. By enabling students to select study rooms and meet up to study in groups, WATStudy aims to create a collaborative and supportive learning environment.

It is a dynamic application designed to facilitate study group formation among students on campus. The primary goal is to enable students to easily find and reserve study rooms across the university, fostering a collaborative learning environment. The application uses a comprehensive dataset containing over a million entries, securely stored in a MySQL database hosted on a Google Cloud MySQL server. The primary users of this application will be students currently enrolled at the University of Waterloo, with plans for future expansion to other universities globally.

Additionally, WATStudy aims to streamline the process of finding and booking study spaces, making it easier for students to collaborate and succeed academically. The application supports various functionalities, such as room availability checks, booking confirmations, and notifications. Additionally, features allow users to form and join study groups based on common courses or subjects, enhancing the overall learning experience. A data analytics page displays the top subjects, courses, and study locations.

The frontend & backend is built using React.js and Node.js, allowing cross-platform functionality and ensuring seamless user experiences. The backend is supported by a GCP MySQL database, chosen for its reliability and scalability. This setup provides the necessary infrastructure to handle the anticipated high volume of data transactions efficiently. Additionally, security protocols are implemented to protect user data and maintain system integrity, such as incorporating JWT for user authentication.

## Datasets (Sample & Production)
There is no need to generate the datasets since we have both the sample and production datasets uploaded here in the GitHub repo - they are located under the `data` folder in the `sample` and `production` folders respectively. If you want to generate additional data, then the highly refined script is located here: `setup/data_scripts/gen_data.py`. The script for loading them into the database is located here: `setup/data_scripts/gen_imports.py`. And the corresponding SQL inserts can be found at `setup/sample_db/populatetables.sql` and `setup/production_db/populatetables.sql`. SQL Code for creating tables, constraints, and triggers is located at `setup/sample_db/createtables.sql` and `setup/production_db/createtables.sql` respectively.


## Implemented Features
All of the following features have been implemented, and the implementations can be found in the `sample_queries` and `production_queries` folders, along with their corresponding outputs (as a `.out` file). We have implemented the 6 full features (3 required, and 3 for earning bonus marks):
- **Search Filter**: Provides advanced querying capabilities based on constraints to return all relevant study sessions from the database
- **Reminder Email**: Enables users to send notification emails to all participants of a study session, containing essential event details
- **Upcoming Weekly Sessions**: Displays a comprehensive dashboard of all upcoming weekly study sessions that a user is registered for
- **Most Studied Course**: Identifies and displays the course that a user has studied the most
- **Most Effective Study Buddies**: Shows users which of their friends have been the most consistent study partners
- **Session Recommendation**: Utilizes a complex algorithm to recommend study sessions to users based on their study history and preferences

As for some of the fancy features, here is a list of what we have added:
- User Friendly Interface
- User Authentication using JWT
- Protection against SQL injection in search filter
- Query Optimization (using indexes, smart filtering)
- Locally Hosted Sign-up Flow for verifying University of Waterloo email

## Project Video
[![Watch the video](https://img.youtube.com/vi/SQRgHQNICu0/maxresdefault.jpg)](https://www.youtube.com/watch?v=SQRgHQNICu0)

## Setup
### Database
We are utilizing Google Cloud MySQL to host our database, ensuring it is live 24/7. Google Cloud Platform (GCP) was selected due to its reliability, scalability, and robust security features.

**To create a local copy of the database:**
1. Install and run MySQL workbench from [dev.mysql.com](https://dev.mysql.com/downloads/workbench/)
2. Run the `createtables.sql` script located at `setup/production_db/` (or `setup/sample_db/` if you want to work with the sample dataset) to create the tables
3. Run the `populatetables.sql` script in the same folder to populate the local database copy

To access the database on GCP, please contact us for the `.env` file. This file contains the necessary environment variables and credentials for connecting to our Google Cloud MySQL Server. Once you have the `.env` file, place it in the `server` folder and follow the instructions below to get started.

### Frontend & Backend
1. Clone the repo:
   `git clone https://github.com/Darsh04-14/WATStudy.git`
2. Install the dependencies:
   `npm install`
3. Run the server:
   `npm run server`
4. Run the client:
   `npm run client`
