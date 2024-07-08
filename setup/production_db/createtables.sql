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


ALTER TABLE session_table ADD INDEX idx_creator_fk (creator_fk);
ALTER TABLE friends ADD INDEX idx_uid1_uid2 (uid1, uid2);
ALTER TABLE participants ADD INDEX idx_sessionId_userId (sessionId, userId);
ALTER TABLE session_review ADD INDEX idx_sessionId_userId (sessionId, userId);
ALTER TABLE verification_table ADD INDEX idx_email (email);

ALTER TABLE session_table
PARTITION BY RANGE (TO_DAYS(session_date)) (
    PARTITION p1 VALUES LESS THAN (TO_DAYS('2024-05-08')),    -- May 1st - May 7th, 2024
    PARTITION p2 VALUES LESS THAN (TO_DAYS('2024-05-15')),    -- May 8th - May 14th, 2024
    PARTITION p3 VALUES LESS THAN (TO_DAYS('2024-05-22')),    -- May 15th - May 21st, 2024
    PARTITION p4 VALUES LESS THAN (TO_DAYS('2024-05-29')),    -- May 22nd - May 28th, 2024
    PARTITION p5 VALUES LESS THAN (TO_DAYS('2024-06-05')),    -- May 29th - June 4th, 2024
    PARTITION p6 VALUES LESS THAN (TO_DAYS('2024-06-12')),    -- June 5th - June 11th, 2024
    PARTITION p7 VALUES LESS THAN (TO_DAYS('2024-06-19')),    -- June 12th - June 18th, 2024
    PARTITION p8 VALUES LESS THAN (TO_DAYS('2024-06-26')),    -- June 19th - June 25th, 2024
    PARTITION p9 VALUES LESS THAN (TO_DAYS('2024-07-03')),    -- June 26th - July 2nd, 2024
    PARTITION p10 VALUES LESS THAN (TO_DAYS('2024-07-10')),   -- July 3rd - July 9th, 2024
    PARTITION p11 VALUES LESS THAN (TO_DAYS('2024-07-17')),   -- July 10th - July 16th, 2024
    PARTITION p12 VALUES LESS THAN (TO_DAYS('2024-07-24')),   -- July 17th - July 23rd, 2024
    PARTITION p13 VALUES LESS THAN (TO_DAYS('2024-07-31')),   -- July 24th - July 30th, 2024
    PARTITION p14 VALUES LESS THAN (TO_DAYS('2024-08-07')),   -- July 31st - August 6th, 2024
    PARTITION p15 VALUES LESS THAN (TO_DAYS('2024-08-14')),   -- August 7th - August 13th, 2024
    PARTITION p16 VALUES LESS THAN (TO_DAYS('2024-08-21')),   -- August 14th - August 20th, 2024
    PARTITION p17 VALUES LESS THAN (TO_DAYS('2024-08-28')),   -- August 21st - August 27th, 2024
    PARTITION p18 VALUES LESS THAN (TO_DAYS('2024-09-04'))    -- August 28th - September 3rd, 2024 (or higher for future dates)
);