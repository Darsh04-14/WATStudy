import random
import datetime
import hashlib

first_names = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth",
    "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
    "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra",
    "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
    "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa", "Edward", "Deborah",
    "Ronald", "Stephanie", "Timothy", "Rebecca", "Jason", "Sharon", "Jeffrey", "Laura", "Ryan", "Cynthia",
    "Jacob", "Kathleen", "Gary", "Amy", "Nicholas", "Shirley", "Eric", "Angela", "Jonathan", "Helen",
    "Stephen", "Anna", "Larry", "Brenda", "Justin", "Pamela", "Scott", "Nicole", "Brandon", "Emma",
    "Frank", "Samantha", "Benjamin", "Katherine", "Gregory", "Christine", "Raymond", "Debra", "Samuel", "Rachel",
    "Patrick", "Catherine", "Alexander", "Carolyn", "Jack", "Janet", "Dennis", "Ruth", "Jerry", "Maria",
    "Tyler", "Heather", "Aaron", "Diane", "Henry", "Virginia", "Douglas", "Julie", "Jose", "Joyce",
    "Peter", "Victoria", "Adam", "Olivia", "Zachary", "Kelly", "Nathan", "Christina", "Walter", "Lauren",
    "Harold", "Joan", "Kyle", "Evelyn", "Carl", "Judith", "Arthur", "Megan", "Gerald", "Cheryl",
    "Roger", "Andrea", "Keith", "Hannah", "Jeremy", "Martha", "Terry", "Jacqueline", "Lawrence", "Frances",
    "Sean", "Gloria", "Christian", "Ann", "Albert", "Teresa", "Joe", "Kathryn", "Ethan", "Sara",
    "Austin", "Janice", "Jesse", "Jean", "Willie", "Alice", "Billy", "Madison", "Bryan", "Doris",
    "Bruce", "Abigail", "Jordan", "Julia", "Ralph", "Judy", "Roy", "Grace", "Noah", "Denise",
    "Dylan", "Marilyn", "Eugene", "Beverly", "Wayne", "Amber", "Alan", "Theresa", "Juan", "Danielle",
    "Louis", "Diana", "Russell", "Brittany", "Gabriel", "Natalie", "Randy", "Isabella", "Philip", "Charlotte",
    "Harry", "Rose", "Vincent", "Alexis", "Bobby", "Kayla", "Johnny", "Lori", "Logan", "Victoria",
    "Stanley", "Sophia", "Leonard", "Ann"
]
last_names = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
    "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes",
    "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper",
    "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson",
    "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes",
    "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez",
    "Powell", "Jenkins", "Perry", "Russell", "Sullivan", "Bell", "Coleman", "Butler", "Henderson", "Barnes",
    "Gonzales", "Fisher", "Vasquez", "Simmons", "Romero", "Jordan", "Patterson", "Alexander", "Hamilton", "Graham",
    "Reynolds", "Griffin", "Wallace", "Moreno", "West", "Cole", "Hayes", "Bryant", "Herrera", "Gibson",
    "Ellis", "Tran", "Medina", "Aguilar", "Stevens", "Murray", "Ford", "Castro", "Marshall", "Owens",
    "Harrison", "Fernandez", "Mcdonald", "Woods", "Washington", "Kennedy", "Wells", "Vargas", "Henry", "Chen",
    "Freeman", "Webb", "Tucker", "Guzman", "Burns", "Crawford", "Olson", "Simpson", "Porter", "Hunter",
    "Gordon", "Mendez", "Silva", "Shaw", "Snyder", "Mason", "Dixon", "Munoz", "Hunt", "Hicks",
    "Holmes", "Palmer", "Wagner", "Black", "Robertson", "Boyd", "Rose", "Stone", "Salazar", "Fox",
    "Warren", "Mills", "Meyer", "Rice", "Schmidt", "Garza", "Daniels", "Ferguson", "Nichols", "Stephens",
    "Soto", "Weaver", "Ryan", "Gardner"
]

titles = [
    "Midterm Review",
    "Final Exam Review",
    "Chapter 1 Overview",
    "Chapter 2 Discussion",
    "Chapter 3 Analysis",
    "Chapter 4 Review",
    "Unit 1 Summary",
    "Unit 2 Breakdown",
    "Unit 3 Key Points",
    "Unit 4 Highlights",
    "Unit 5 Essentials",
    "Topic 1 Exploration",
    "Topic 2 Examination",
    "Topic 3 Insights",
    "Topic 4 Discussion",
    "Topic 5 Review",
    "Quiz 1 Preparation",
    "Quiz 2 Preparation",
    "Quiz 3 Preparation",
    "Homework Help Session",
    "Lab Report Review",
    "Project Planning",
    "Group Study Session",
    "Weekly Study Group",
    "Bi-weekly Study Group",
    "Monthly Study Group",
    "Exam Strategies",
    "Problem-Solving Session",
    "Practice Exam Session",
    "Case Study Review",
    "Interactive Workshop",
    "Collaborative Study Session",
    "Research Discussion",
    "Essay Writing Workshop",
    "Peer Review Session",
    "Concept Mapping",
    "Flashcard Session",
    "Mock Test Session",
    "Reading Comprehension Review",
    "Formula Memorization",
    "Equation Solving Techniques",
    "Graph Analysis",
    "Data Interpretation",
    "Statistics Review",
    "Probability Session",
    "Hypothesis Testing",
    "Theorem Review",
    "Principles of Science",
    "Scientific Method Overview",
    "Experiment Discussion",
    "Lab Techniques",
    "Programming Basics",
    "Advanced Programming",
    "Coding Practice",
    "Algorithm Analysis",
    "Data Structure Review",
    "Software Engineering Concepts",
    "Database Essentials",
    "Web Development Fundamentals",
    "Advanced Web Development",
    "Machine Learning Basics",
    "Artificial Intelligence Overview",
    "Deep Learning Introduction",
    "Neural Networks Session",
    "Cybersecurity Basics",
    "Network Fundamentals",
    "Operating Systems Review",
    "Computer Architecture",
    "Digital Logic Design",
    "Compiler Design",
    "Programming Languages",
    "Discrete Mathematics",
    "Linear Algebra",
    "Calculus Review",
    "Differential Equations",
    "Complex Variables",
    "Probability and Statistics",
    "Economics Review",
    "Microeconomics Session",
    "Macroeconomics Session",
    "Financial Accounting",
    "Managerial Accounting",
    "Marketing Principles",
    "Business Strategy",
    "Organizational Behavior",
    "Human Resource Management",
    "Operations Management",
    "Project Management",
    "Supply Chain Management",
    "Business Ethics",
    "Corporate Finance",
    "Investment Analysis",
    "International Business",
    "Entrepreneurship",
    "Innovation Management",
    "Leadership Skills",
    "Negotiation Techniques",
    "Communication Skills",
    "Presentation Skills",
    "Time Management",
    "Stress Management",
    "Career Planning",
    "Resume Building",
    "Interview Preparation",
    "Networking Strategies",
    "Professional Development",
    "Public Speaking",
    "Team Building",
    "Conflict Resolution",
    "Cultural Competence",
    "Language Learning",
    "Creative Writing",
    "Literature Review",
    "Historical Analysis",
    "Philosophical Discussion",
    "Ethics Review",
    "Political Science Overview",
    "Sociology Session",
    "Psychology Basics",
    "Anthropology Discussion",
    "Geography Review",
    "Environmental Science",
    "Climate Change Discussion",
    "Sustainable Development",
    "Urban Planning",
    "Architecture Basics",
    "Design Thinking",
    "Art History",
    "Music Theory",
    "Theater Studies",
    "Film Analysis",
    "Photography Techniques",
    "Visual Arts Workshop",
    "Dance Session",
    "Physical Education",
    "Health and Wellness",
    "Nutrition Basics",
    "First Aid Training",
    "Sports Science",
    "Yoga Session",
    "Meditation Session",
    "Mindfulness Techniques",
    "Personal Finance",
    "Investment Strategies",
    "Tax Preparation",
    "Retirement Planning",
    "Estate Planning",
    "Insurance Basics",
    "Real Estate Investing",
    "Cryptocurrency Basics",
    "Blockchain Technology",
    "Technology Trends",
    "Innovation in Technology",
    "Start-up Strategies",
    "Product Development",
    "Market Research",
    "Consumer Behavior",
    "Sales Techniques",
    "Customer Service Skills",
    "E-commerce Basics",
    "Digital Marketing",
    "Social Media Marketing",
    "SEO Fundamentals",
    "Content Marketing",
    "Brand Management",
    "Advertising Strategies",
    "Public Relations",
    "Media Studies",
    "Journalism Basics",
    "Creative Arts Session",
    "Digital Arts Session",
    "Game Design Basics",
    "Animation Techniques",
    "3D Modeling",
    "Virtual Reality",
    "Augmented Reality",
    "HCI Fundamentals",
    "UI/UX Design",
    "Product Management",
    "Supply Chain Strategies",
    "Lean Management",
    "Agile Methodologies",
    "Scrum Basics",
    "Kanban Techniques",
    "Risk Management",
    "Quality Management",
    "Compliance Strategies",
    "Business Continuity",
    "Disaster Recovery",
    "Security Management",
    "IT Governance",
    "DevOps Fundamentals",
    "Cloud Computing",
    "Big Data Analytics",
    "Data Science Basics",
    "Statistics in Data Science",
    "Python Programming",
    "R Programming",
    "Data Visualization",
    "Machine Learning Algorithms",
    "Natural Language Processing",
    "Robotics Basics",
    "Automation Techniques",
    "IoT Fundamentals",
    "Smart Home Technologies",
    "Wearable Technology",
    "Mobile App Development",
    "Software Testing",
    "Quality Assurance",
    "System Design",
    "Enterprise Architecture",
    "Tech Entrepreneurship",
    "Venture Capital",
    "Business Model Innovation",
    "Strategic Management",
    "Competitive Analysis",
    "Market Entry Strategies",
    "Growth Hacking"
]
descriptions = [
    "This session will cover the essential topics and key concepts.",
    "Join us for a comprehensive review and in-depth discussion.",
    "An overview of the main ideas and fundamental principles.",
    "A focused session on critical points and important details.",
    "An interactive workshop with practical examples and exercises.",
    "A collaborative study session to discuss and understand core concepts.",
    "A deep dive into specific topics and advanced ideas.",
    "A review session to prepare for upcoming exams and assessments.",
    "A detailed analysis of complex problems and their solutions.",
    "A discussion session to clarify doubts and strengthen understanding.",
    "A summary of key points and takeaways from the chapter.",
    "A comprehensive breakdown of essential topics and their applications.",
    "An engaging session to explore and discuss important concepts.",
    "A practical session to apply knowledge through exercises and examples.",
    "A review of the chapter with a focus on key takeaways and applications.",
    "An in-depth session to understand and analyze important topics.",
    "A preparation session for quizzes with practice questions and tips.",
    "A homework help session to solve and discuss assignments.",
    "A review session for lab reports with detailed explanations and tips.",
    "A project planning session to outline and organize tasks and goals.",
    "A group study session to discuss and collaborate on key topics.",
    "A weekly study group to review and discuss course material.",
    "A bi-weekly study group to engage in deep discussions and reviews.",
    "A monthly study group to summarize and analyze course content.",
    "A session on exam strategies and techniques for better performance.",
    "A problem-solving session to tackle challenging questions and problems.",
    "A practice exam session with sample questions and detailed solutions.",
    "A case study review to analyze real-world examples and scenarios.",
    "An interactive workshop to engage in hands-on learning activities.",
    "A collaborative study session to share knowledge and insights.",
    "A research discussion to explore and analyze academic papers and studies.",
    "An essay writing workshop to improve writing skills and techniques.",
    "A peer review session to provide and receive feedback on assignments.",
    "A concept mapping session to visualize and organize key ideas.",
    "A flashcard session to reinforce and memorize important concepts.",
    "A mock test session to simulate exam conditions and practice.",
    "A reading comprehension review to improve understanding and retention.",
    "A formula memorization session to learn and remember key formulas.",
    "An equation solving techniques session to master problem-solving skills.",
    "A graph analysis session to interpret and understand data representations.",
    "A data interpretation session to analyze and make sense of data.",
    "A statistics review session to understand key concepts and applications.",
    "A probability session to explore and understand probability concepts.",
    "A hypothesis testing session to learn and apply testing methods.",
    "A theorem review session to understand and apply important theorems.",
    "A principles of science session to explore foundational scientific ideas.",
    "A scientific method overview to understand and apply the scientific method.",
    "An experiment discussion session to analyze and understand experiments.",
    "A lab techniques session to learn and practice essential lab skills.",
    "A programming basics session to learn and apply fundamental coding skills.",
    "An advanced programming session to explore and apply advanced coding concepts.",
    "A coding practice session to improve coding skills through exercises.",
    "An algorithm analysis session to understand and analyze algorithms.",
    "A data structure review session to understand and apply data structures.",
    "A software engineering concepts session to explore key ideas and practices.",
    "A database essentials session to understand and apply database concepts.",
    "A web development fundamentals session to learn and apply web development skills.",
    "An advanced"
]

def generate_random_name():
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    return f"{first_name} {last_name}"

def generate_random_email(name, existing_emails):
    base_email = name.replace(' ', '.').lower()
    email = f"{base_email}@uwaterloo.ca"
    counter = 1
    while email in existing_emails:
        email = f"{base_email}{counter}@uwaterloo.ca"
        counter += 1
    existing_emails.add(email)
    return email

def encrypt_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def generate_random_password():
    words = [
        'apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon',
        'mango', 'nectarine', 'orange', 'papaya', 'quince', 'raspberry', 'strawberry', 'tangerine', 'ugli', 'vanilla',
        'watermelon', 'xigua', 'yellow', 'zucchini', 'ant', 'bat', 'cat', 'dog', 'elephant', 'frog',
        'goat', 'horse', 'iguana', 'jellyfish', 'kangaroo', 'lion', 'monkey', 'newt', 'owl', 'penguin',
        'quail', 'rabbit', 'shark', 'turtle', 'urchin', 'vulture', 'whale', 'xerus', 'yak', 'zebra',
        'autumn', 'breeze', 'cloud', 'dew', 'earth', 'flower', 'grass', 'hill', 'ice', 'jungle',
        'kettle', 'lake', 'mountain', 'night', 'ocean', 'peak', 'quartz', 'river', 'sand', 'tree',
        'umbrella', 'valley', 'wind', 'xylophone', 'yawn', 'zephyr'
    ]
    password = ''.join(random.choice(words) for _ in range(3)) + str(random.randint(10, 99))
    return password

def generate_user(existing_emails):
    name = generate_random_name()
    email = generate_random_email(name, existing_emails)
    password = generate_random_password()
    return {
        'name': name,
        'email': email,
        'password': password
    }

def generate_friend_pairs(num_pairs, num_users):
    pairs = set()
    while len(pairs) < num_pairs:
        uid1 = random.randint(1, num_users)
        uid2 = random.randint(1, num_users)
        if uid1 != uid2:
            # Ensure unique pairs by storing them in sorted order
            pairs.add((min(uid1, uid2), max(uid1, uid2)))
    return pairs

def generate_insert_statements(pairs):
    insert_statements = []
    for uid1, uid2 in pairs:
        insert_statements.append(f"INSERT INTO watstudy.friends (uid1, uid2) VALUES ({uid1}, {uid2});")
        insert_statements.append(f"INSERT INTO watstudy.friends (uid1, uid2) VALUES ({uid2}, {uid1});")
    return insert_statements

def generate_enrollments(num_students, courses):
    enrollments = set()
    for uid in range(1, num_students + 1):
        num_courses = random.randint(1, 8)  # Random number of courses between 1 and 8
        enrolled_courses = random.sample(courses, num_courses)
        for cid in enrolled_courses:
            enrollments.add((uid, cid))
    return enrollments

def read_courses(file_path):
    with open(file_path, 'r') as file:
        courses = [line.strip() for line in file.readlines()]
    return courses

def generate_random_title():
    return random.choice(titles)

def generate_random_description():
    return random.choice(descriptions)

def generate_random_session_date():
    start_date = datetime.datetime(2024, 5, 1, 0, 0, 0)
    end_date = datetime.datetime(2024, 8, 16, 23, 55, 0)
    delta = end_date - start_date
    random_minutes = random.randint(0, int(delta.total_seconds() / 60 / 5)) * 5
    session_date = start_date + datetime.timedelta(minutes=random_minutes)
    return session_date.strftime("%Y-%m-%d %H:%M:%S")

def generate_random_duration():
    durations = [15, 30, 45, 60, 90, 120]
    return random.choice(durations)

def generate_random_group_size():
    return random.randint(1, 10)

def generate_random_creator_fk():
    return random.randint(1, 200)

def generate_random_location():
    buildings = [
        "DC", "EIT", "MC", "SLC", "STC", "QNC", "E7", "E6", "E5", "E3",
        "E2", "E1", "PAS", "HH", "AL", "EV3", "EV2", "EV1", "OPT",
        "BMH", "RCH", "ML", "CPH"
    ]
    building = random.choice(buildings)
    room_number = random.randint(1000, 4499)
    return f"{building}{room_number}"

def generate_review_session(courses):
    subject = random.choice(courses)
    title = generate_random_title()
    description = generate_random_description()
    session_date = generate_random_session_date()
    duration = generate_random_duration()
    group_size = generate_random_group_size()
    creator_fk = generate_random_creator_fk()
    location = generate_random_location()
    return {
        'subject': subject,
        'title': title,
        'description': description,
        'session_date': session_date,
        'duration': duration,
        'group_size': group_size,
        'creator_fk': creator_fk,
        'location': location
    }

# Example usage
if __name__ == "__main__":
    num_users = 5000  # Number of users to generate
    existing_emails = set()
    users = [generate_user(existing_emails) for _ in range(num_users)]
    with open("users_raw.txt", 'w') as f:
        for user in users:
            print(f"{user['name']}, {user['email']}, {user['password']}", file=f)
    f.close()
    with open("user_table.txt", 'w') as f:
        print("name,email,password", file=f)
        for user in users:
            print(f"{user['name']}, \"{user['email']}\", \"{encrypt_password(user['password'])}\"", file=f)
    f.close()
    with open('friends.txt', 'w') as f:
        pairs = generate_friend_pairs(20000, 5000)
        print("uid1,uid2", file=f)
        for uid1, uid2 in pairs:
            print(f"{uid1}, {uid2}",file=f)
            print(f"{uid2}, {uid1}",file=f)
    f.close()
    with open("enrolled.txt", 'w') as f:
        courses = read_courses("courses.txt")
        enrolled = generate_enrollments(num_users, courses)
        print("uid,cid", file=f)
        for uid, cid in enrolled:
            print(f"{uid}, {cid}", file=f)
    f.close()
    with open("session_table.txt", 'w') as f, open("participants.txt", 'w') as g, open("session_review.txt", 'w') as h:
        num_sessions = 50000
        review_sessions = [generate_review_session(courses) for _ in range(num_sessions)]
        print("subject,title,description,session_date,duration,group_size,creator_fk,location", file=f)
        print("sessionId, userId, review", file = h)
        print("sessionId, userId", file = g)
        sid = 0
        for session in review_sessions:
            sid += 1
            num_participants = random.randint(1, session['group_size'])
            participants = set()
            participants.add(session['creator_fk'])
            for i in range(1, num_participants + 1):
                p = random.randint(1, num_users + 1)
                if p not in participants:
                    participants.add(p)
                    print(f"{sid}, {p}", file = g)

            for i in participants:
                r = random.randint(1, 20)
                if r <= 10:
                    print(f"{sid}, {i}, {r}", file=h)

            print(f"{session['subject']}, \"{session['title']}\", \"{session['description']}\", "
                  f"\"{session['session_date']}\", {session['duration']}, "
                  f"{session['group_size']}, {session['creator_fk']}, \"{session['location']}\"", file=f)
    f.close()
    g.close()
    h.close()