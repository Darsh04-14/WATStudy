
CREATE TABLE user_table (
    uid INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    CONSTRAINT email_unique UNIQUE (email)
);


CREATE TABLE session_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    session_date DATETIME NOT NULL,
    duration INT NOT NULL,
    group_size INT NOT NULL,
    creator_fk INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    CONSTRAINT fk_creator FOREIGN KEY (creator_fk) REFERENCES user_table(uid) ON DELETE CASCADE
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
