CREATE TABLE watstudy.user_table (
    uid INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    CONSTRAINT uwaterloo_email CHECK (email LIKE '%@uwaterloo.ca')
);

CREATE TABLE watstudy.courses (
    cid CHAR(10) PRIMARY KEY
);

CREATE TABLE watstudy.session_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject CHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    session_date DATETIME NOT NULL,
    duration INT NOT NULL,
    group_size INT NOT NULL,
    creator_fk INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    CONSTRAINT fk_creator FOREIGN KEY (creator_fk) REFERENCES user_table(uid) ON DELETE CASCADE,
    CONSTRAINT fk_subject FOREIGN KEY (subject) REFERENCES courses(cid) ON DELETE CASCADE
);

CREATE TABLE watstudy.enrolled (
    uid INT NOT NULL,
    cid CHAR(10) NOT NULL,
    PRIMARY KEY (uid, cid),
    CONSTRAINT fk_student_enrolled FOREIGN KEY (uid) REFERENCES user_table(uid) ON DELETE CASCADE,
    CONSTRAINT fk_course_enrolled FOREIGN KEY (cid) REFERENCES courses(cid) ON DELETE CASCADE
);


CREATE TABLE watstudy.friends (
    uid1 INT,
    uid2 INT,
    PRIMARY KEY (uid1, uid2),
    CONSTRAINT fk_friend1 FOREIGN KEY (uid1) REFERENCES user_table(uid) ON DELETE CASCADE,
    CONSTRAINT fk_friend2 FOREIGN KEY (uid2) REFERENCES user_table(uid) ON DELETE CASCADE,
    CONSTRAINT noSelfFriend CHECK (uid1 != uid2)
);


CREATE TABLE watstudy.participants (
    sessionId INT NOT NULL,
    userId INT NOT NULL,
    PRIMARY KEY (sessionId, userId),
    CONSTRAINT fk_session FOREIGN KEY (sessionId) REFERENCES session_table(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES user_table(uid) ON DELETE CASCADE
);


CREATE TABLE watstudy.session_review (
    sessionId INT NOT NULL,
    userId INT NOT NULL,
    review INT NOT NULL,
    PRIMARY KEY (sessionId, userId),
    CONSTRAINT review_check CHECK (review BETWEEN 1 AND 10),
    CONSTRAINT fk_review_session FOREIGN KEY (sessionId) REFERENCES session_table(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_user FOREIGN KEY (userId) REFERENCES user_table(uid) ON DELETE CASCADE
);


CREATE TABLE watstudy.verification_table (
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiry_date DATETIME NOT NULL,
    PRIMARY KEY (email),
    CONSTRAINT fk_verification_email FOREIGN KEY (email) REFERENCES user_table(email) ON DELETE CASCADE
);