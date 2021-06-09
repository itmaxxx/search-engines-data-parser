CREATE DATABASE SearchEnginesParser;

USE SearchEnginesParser;

CREATE TABLE Users
(
  Id INT PRIMARY KEY AUTO_INCREMENT,
  Username VARCHAR(32),
  Password VARCHAR(256)
);