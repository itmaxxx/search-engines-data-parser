CREATE DATABASE search_engines_parser;

USE search_engines_parser;

CREATE TABLE Users
(
  Id INT PRIMARY KEY AUTO_INCREMENT,
  Username VARCHAR(32),
  Password VARCHAR(256)
);

CREATE TABLE Queries
(
  Id INT PRIMARY KEY AUTO_INCREMENT,
  Query VARCHAR(256),
  Status VARCHAR(256),
  Error VARCHAR(256),
  LinksCount INT,
  CurrentLink INT,
  Output VARCHAR(256),
  Excel VARCHAR(256)
);
