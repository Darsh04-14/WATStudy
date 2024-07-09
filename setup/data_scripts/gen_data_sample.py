import requests
import random
from datetime import datetime, timedelta

def random_date():
    start_date = datetime(2024, 7, 1)
    end_date = datetime(2024, 8, 15)
    delta = end_date - start_date
    random_days = random.randint(0, delta.days)
    random_seconds = random.randint(0, 86399)
    random_date = start_date + timedelta(days=random_days, seconds=random_seconds)
    
    minutes = (random_date.minute // 5) * 5 + (5 if random_date.minute % 5 >= 2.5 else 0)
    if minutes == 60:
        random_date += timedelta(hours=1)
        minutes = 0
    random_date = random_date.replace(minute=minutes, second=0, microsecond=0)
    
    return random_date.isoformat().replace("T", " ")


def generate_study_session():
    creators = [102, 103]
    subjects = ["CS", "BIOL", "GS", "PSYCH", "STAT", "ECE", "CHE", "MATH", "PHYS", "SE", "SYDE", "ME", "CIVE", "NE", "BME", "KIN", "REC", "PHARM", "AFM", "ARTS", "ENV", "GEOG", "HIST", "HRM", "LS", "MUSIC", "PSCI", "REC", "SOC", "SPAN", "SUSM"]
    titles = [
        "Study Group Session", "Review Meeting", "Assignment Help", "Project Brainstorming", "Collaborative Study",
        "Research Guidance", "Quiz Preparation", "Seminar Follow-Up", "Lab Report Assistance", "Thesis Consultation",
        "Finals Preparation", "Group Learning Session", "Interactive Study Group", "Case Study Discussion", "Topic Review",
        "Peer Support", "Online Resource Session", "Interactive Quiz", "Concept Discussion", "Presentation Practice",
        "Reading Group", "Writing Workshop", "Problem-Solving Session", "Discussion on Trends", "Career Advice Session",
        "Knowledge Sharing", "Skill Development Workshop", "Practical Session", "Focused Study", "General Study Session",
        "Topic Exploration", "Resource Sharing", "Interactive Workshop", "Discussion Forum", "Knowledge Enhancement",
        "Study Planning", "Test Preparation", "Peer Review Session", "Content Recap", "Mock Exam Session",
        "Topic Mastery Session", "Subject Review", "Interactive Learning", "Practical Demonstration", "Study Skills Workshop",
        "Topic Deep Dive", "Learning Strategies", "Group Discussion", "Academic Support", "Focused Review Session", "Quiz Practice Session", "Concept Clarification Session", "Presentation Practice",
        "Reading Session", "Writing Workshop", "Problem-Solving Session", "Discussion on Current Topics",
        "Career Development Session"
    ]
    descriptions = [
        "Discussing key topics for the upcoming exam", "Reviewing recent assignments and providing help", "Collaborating on project ideas", 
        "Group study session to prepare for quizzes", "Guidance on research methodology", "Interactive discussion of seminar content", 
        "Assistance with writing lab reports", "Consultation on thesis structure and content", "Effective strategies for final exams", 
        "Collaborative learning and peer support", "Detailed discussion of case studies", "Overview of important topics", 
        "Support for academic writing tasks", "Problem-solving techniques and strategies", "Discussion on the latest trends in the field", 
        "Career guidance and advice", "Sharing of useful online resources", "Interactive quiz to test knowledge", "Clarifying difficult concepts", 
        "Practice for group presentations", "Engaging in critical reading exercises", "Workshop on academic writing skills", 
        "Solving practice problems together", "Talking about recent developments in the subject", "Professional development tips", 
        "Enhancing knowledge through group discussion", "Workshop on developing new skills", "Hands-on practical session", 
        "Focused study on specific topics", "General study session covering a range of subjects", "Exploring new topics in-depth", 
        "Session for sharing study resources", "Interactive workshop on a key topic", "Open forum for discussing ideas", 
        "Session to enhance knowledge and skills", "Planning and organizing study schedules", "Preparation for upcoming tests", 
        "Review and feedback on assignments", "Recap of course content", "Mock exams and practice questions", 
        "Mastering key topics through focused study", "In-depth review of subject material", "Interactive learning activities", 
        "Practical demonstrations of key concepts", "Workshop on effective study skills", "Deep dive into specific topics", 
        "Strategies for effective learning", "Open group discussion on course material", "Providing academic support and guidance", 
        "Focused review session for important topics"
    ]
    durations = [30, 60, 90, 120]
    group_sizes = range(2, 11)
    buildings = ["DC", "EIT", "MC", "SLC", "STC", "QNC", "E7", "E6", "E5", "E3", "E2", "E1", "PAS", "HH", "AL", "EV3", "EV2", "EV1", "OPT", "BMH", "RCH", "ML", "CPH"]

    creator_fk = random.choice(creators)
    subject = f"{random.choice(subjects)} {random.randint(100, 442)}"
    title = random.choice(titles)
    description = random.choice(descriptions)
    session_date = random_date()
    duration = random.choice(durations)
    group_size = random.choice(group_sizes)
    building = random.choice(buildings)
    room = f"{random.randint(1000, 4499)}"
    location = f"{building} {room}"

    return {
        "creator_fk": creator_fk,
        "subject": subject,
        "title": title,
        "description": description,
        "session_date": session_date,
        "duration": duration,
        "group_size": group_size,
        "location": location
    }

def post_study_session(session_data):
    url = "http://localhost:3800/studysession"
    response = requests.post(url, json=session_data)
    if response.status_code == 200:
        print(f"Successfully posted: {session_data}")
    else:
        print(f"Failed to post: {session_data}. Status Code: {response.status_code}")

for i in range(5000): 
    session_data = generate_study_session()
    post_study_session(session_data)
