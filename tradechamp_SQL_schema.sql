--DROP database IF EXISTS tradechamp;
--CREATE database tradechamp;
USE tradechamp;

-- Create Company Stocks Table
DROP TABLE IF EXISTS company_stocks;

CREATE TABLE company_stocks (
    companyID INT AUTO_INCREMENT PRIMARY KEY,
    companyName VARCHAR(100) NOT NULL,
    date_Time DATETIME NOT NULL,
    volume INT NOT NULL,
    closingPrice DECIMAL(10, 2) NOT NULL,
    priceChange DECIMAL(10, 2),
    changePercentage DECIMAL(5, 2)
);

-- Create Owned Stocks Table
DROP TABLE IF EXISTS owned_stocks;

CREATE TABLE owned_stocks (
    stockID INT NOT NULL,
    companyID INT NOT NULL,
    stocksOwned INT NOT NULL,
    PRIMARY KEY (stockID, companyID),
    FOREIGN KEY (companyID) REFERENCES company_stocks(companyID)
);

DROP TABLE IF EXISTS user;
-- Create User Table
CREATE TABLE user (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    userPassword VARCHAR(255) NOT NULL,
    role ENUM('admin', 'regular') NOT NULL,
    active ENUM('online', 'offline') NOT NULL,
    coins INT DEFAULT 0,
    stockID INT,
	FOREIGN KEY(stockID) REFERENCES owned_stocks(stockID)-- This could be a foreign key if you have a Stock table
);

-- Create FriendList Table
DROP TABLE IF EXISTS friendlist;

CREATE TABLE friendlist (
    friendListID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    userID INT NOT NULL,
    FOREIGN KEY (username) REFERENCES user(username),
    FOREIGN KEY (userID) REFERENCES user(userID)
);

-- Create Friend_Request Table
DROP TABLE IF EXISTS friend_request;

CREATE TABLE friend_request (
    requestID INT AUTO_INCREMENT PRIMARY KEY,
    from_UserID INT NOT NULL,
    to_UserID INT NOT NULL,
    `status` ENUM('pending', 'accepted', 'rejected') NOT NULL,
    FOREIGN KEY (from_UserID) REFERENCES user(userID),
    FOREIGN KEY (to_UserID) REFERENCES user(userID)
);

-- Create Achievement/Reward Table
DROP TABLE IF EXISTS achievement_reward;

CREATE TABLE achievement_reward (
    achievementRewardID INT AUTO_INCREMENT PRIMARY KEY,
    achievementName VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL
);

-- Create Assigned Achievements/Reward Table
DROP TABLE IF EXISTS assigned_achievements_reward;

CREATE TABLE assigned_achievements_reward (
    assignedAchievementRewardID INT AUTO_INCREMENT PRIMARY KEY,
    achievementRewardID INT NOT NULL,
    userID INT NOT NULL,
    dateAwarded DATE NOT NULL,
    FOREIGN KEY (achievementRewardID) REFERENCES achievement_reward(achievementRewardID),
    FOREIGN KEY (userID) REFERENCES user(userID)
);

-- Create Progress Tracking Table
DROP TABLE IF EXISTS progress_tracking;

CREATE TABLE progress_tracking (
    progressID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    moduleID INT NOT NULL,
    progressdate DATE NOT NULL,
    FOREIGN KEY (userID) REFERENCES user(userID)
);

-- Create Forum Table
DROP TABLE IF EXISTS forum;

CREATE TABLE forum (
    forumID INT AUTO_INCREMENT PRIMARY KEY,
    forumName VARCHAR(100) NOT NULL,
    creator INT NOT NULL,
    dateCreated DATE NOT NULL,
    isDeleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (creator) REFERENCES user(userID)
);

-- Create Post Table
DROP TABLE IF EXISTS post;

CREATE TABLE post (
    postID INT AUTO_INCREMENT PRIMARY KEY,
    forumID INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    creator INT NOT NULL,
    dateCreated DATE NOT NULL,
    body TEXT NOT NULL,
    isDeleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (forumID) REFERENCES forum(forumID),
    FOREIGN KEY (creator) REFERENCES user(userID)
);

-- Create Comment Table
DROP TABLE IF EXISTS comment;

CREATE TABLE comment (
    commentID INT AUTO_INCREMENT PRIMARY KEY,
    postID INT NOT NULL,
    creator INT NOT NULL,
    body TEXT NOT NULL,
    dateCreated DATE NOT NULL,
    isDeleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (postID) REFERENCES post(postID),
    FOREIGN KEY (creator) REFERENCES user(userID)
);

-- Create Thread Table
DROP TABLE IF EXISTS thread;

CREATE TABLE thread (
    threadID INT AUTO_INCREMENT PRIMARY KEY,
    replyCommentID INT,
    replyThreadID INT,
    creator INT NOT NULL,
    dateCreated DATE NOT NULL,
    body TEXT NOT NULL,
    isDeleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (replyCommentID) REFERENCES comment(commentID),
    FOREIGN KEY (replyThreadID) REFERENCES thread(threadID),
    FOREIGN KEY (creator) REFERENCES user(userID)
);


-- Create News Table
DROP TABLE IF EXISTS news;

CREATE TABLE news (
    newsID INT AUTO_INCREMENT PRIMARY KEY,
    dateCreated DATE NOT NULL,
    newsContent TEXT NOT NULL,
    companyID INT,
    FOREIGN KEY(companyID) REFERENCES company_stocks(companyID)
);


-- Create Trade Stocks Table
DROP TABLE IF EXISTS trade_stocks;

CREATE TABLE trade_stocks (
    buyingUserID INT NOT NULL,
    sellingUserID INT NOT NULL,
    transactionDate DATETIME NOT NULL,
    sellingPrice DECIMAL(10, 2) NOT NULL,
    stocksExchanged INT NOT NULL,
    companyID INT NOT NULL,
    PRIMARY KEY (buyingUserID, sellingUserID, transactionDate),
    FOREIGN KEY (buyingUserID) REFERENCES user(userID),
    FOREIGN KEY (sellingUserID) REFERENCES user(userID),
    FOREIGN KEY (companyID) REFERENCES company_stocks(companyID)
);

-- Create Section Table
DROP TABLE IF EXISTS section;

CREATE TABLE section (
    sectionID INT AUTO_INCREMENT PRIMARY KEY,
    sectionName VARCHAR(100) NOT NULL,
    sectionDifficulty ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL
);

-- Create Module Table
DROP TABLE IF EXISTS module;

CREATE TABLE module (
    moduleID INT AUTO_INCREMENT PRIMARY KEY,
    sectionID INT NOT NULL,
    moduleName VARCHAR(100) NOT NULL,
    FOREIGN KEY (sectionID) REFERENCES section(sectionID)
);

-- Create Lesson Table
DROP TABLE IF EXISTS lesson;

CREATE TABLE lesson (
    lessonID INT AUTO_INCREMENT PRIMARY KEY,
    moduleID INT NOT NULL,
    lessonName VARCHAR(100) NOT NULL,
    lessonContent TEXT NOT NULL,
    FOREIGN KEY (moduleID) REFERENCES module(moduleID)
);

