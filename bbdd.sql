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
    RegistrationDate DATETIME NOT NULL DEFAULT GETDATE()
);

-- Create Auth table
CREATE TABLE Auth(
    Email NVARCHAR(100) PRIMARY KEY,
    PasswordHash VARBINARY(MAX),
    PasswordSalt VARBINARY(MAX)
);

-- Create Expenses table
CREATE TABLE Expenses (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    Category NVARCHAR(255) NULL,
    Amount DECIMAL(18, 2) NOT NULL,
    Description NVARCHAR(255) NULL,
    Date DATE NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    CONSTRAINT UQ_Expenses_Description_Amount_Date UNIQUE (Description, Amount, Date)
);

-- Create Incomes table
CREATE TABLE Incomes (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    Category NVARCHAR(255) NULL,
    Amount DECIMAL(18, 2) NOT NULL,
    Description NVARCHAR(255) NULL,
    Date DATE NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    CONSTRAINT UQ_Incomes_Description_Amount_Date UNIQUE (Description, Amount, Date)
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
