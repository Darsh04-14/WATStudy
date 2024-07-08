CREATE TABLE user_table (
    uid INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    CONSTRAINT email_unique UNIQUE (email),
    CONSTRAINT uwaterloo_email CHECK (email LIKE '%@uwaterloo.ca')
);


CREATE TABLE enrolled (
    uid INT NOT NULL,
    cid CHAR(10) NOT NULL,
    PRIMARY KEY (uid, cid),
    CONSTRAINT fk_student_enrolled FOREIGN KEY (uid) REFERENCES students(uid) ON DELETE CASCADE,
    CONSTRAINT fk_course_enrolled FOREIGN KEY (cid) REFERENCES courses(cid) ON DELETE CASCADE
);

CREATE TABLE courses (
    cid CHAR(10) PRIMARY KEY
);


CREATE TABLE session_table (
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


CREATE TABLE friends (
    uid1 INT,
    uid2 INT,
    PRIMARY KEY (uid1, uid2),
    CONSTRAINT fk_friend1 FOREIGN KEY (uid1) REFERENCES user_table(uid) ON DELETE CASCADE,
    CONSTRAINT fk_friend2 FOREIGN KEY (uid2) REFERENCES user_table(uid) ON DELETE CASCADE,
    CONSTRAINT noSelfFriend CHECK (uid1 != uid2);
);


CREATE TABLE participants (
    sessionId INT NOT NULL,
    userId INT NOT NULL,
    PRIMARY KEY (sessionId, userId),
    CONSTRAINT fk_session FOREIGN KEY (sessionId) REFERENCES session_table(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES user_table(uid) ON DELETE CASCADE
);


CREATE TABLE session_review (
    sessionId INT NOT NULL,
    userId INT NOT NULL,
    review INT NOT NULL,
    PRIMARY KEY (sessionId, userId),
    CONSTRAINT review_check CHECK (review BETWEEN 1 AND 10),
    CONSTRAINT fk_review_session FOREIGN KEY (sessionId) REFERENCES session_table(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_user FOREIGN KEY (userId) REFERENCES user_table(uid) ON DELETE CASCADE
);


CREATE TABLE verification_table (
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiry_date DATETIME NOT NULL,
    PRIMARY KEY (email),
    CONSTRAINT fk_verification_email FOREIGN KEY (email) REFERENCES user_table(email) ON DELETE CASCADE
);

DELIMITER //

CREATE TRIGGER ReviewOnlyIfParticipated
BEFORE INSERT ON watstudy.session_review
FOR EACH ROW
BEGIN
    DECLARE participant_count INT;

    SELECT COUNT(*) INTO participant_count
    FROM watstudy.participants
    WHERE sessionId = NEW.sessionId
    AND userId = NEW.userId;

    IF participant_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User must participate in the session to leave a review';
    END IF;
END //

CREATE TRIGGER ParticipantsCannotExceedGroupSize
BEFORE INSERT ON watstudy.participants
FOR EACH ROW
BEGIN
    DECLARE current_participants INT;

    SELECT COUNT(*) INTO current_participants
    FROM watstudy.participants
    WHERE sessionId = NEW.sessionId;

    DECLARE max_group_size INT;
    SELECT group_size INTO max_group_size
    FROM watstudy.session_table
    WHERE id = NEW.sessionId;

    IF current_participants >= max_group_size THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot exceed group size limit for this session';
    END IF;
END //

DELIMITER ;