-- Replace 'ExpenseManagementDB' with the desired name for your database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ExpenseManagementDB')
BEGIN
    CREATE DATABASE ExpenseManagementDB;
END
GO

-- Use the newly created database
USE ExpenseManagementDB;
GO

-- Create Users table
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) UNIQUE NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    RegistrationDate DATETIME NOT NULL DEFAULT GETDATE(),
);

CREATE TABLE Auth(
	Email NVARCHAR(50) PRIMARY KEY,
	PasswordHash VARBINARY(MAX),
	PasswordSalt VARBINARY(MAX)
)

-- Create Categories table
CREATE TABLE Categories (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(50) UNIQUE NOT NULL,
    Description NVARCHAR(255) NULL
);

-- Create Expenses table
CREATE TABLE Expenses (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    CategoryId INT NOT NULL,
    Amount DECIMAL(18, 2) NOT NULL,
    Description NVARCHAR(255) NULL,
    Date DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);

-- Create XMLFiles table
CREATE TABLE XMLFiles (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    FileName NVARCHAR(255) NOT NULL,
    UploadDate DATETIME NOT NULL DEFAULT GETDATE(),
    XMLContent XML NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);
