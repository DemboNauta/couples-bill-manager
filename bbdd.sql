-- Reemplaza 'GestionGastosDB' por el nombre que desees para tu base de datos
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'GestionGastosDB')
BEGIN
    CREATE DATABASE GestionGastosDB;
END
GO

-- Usar la base de datos recién creada
USE GestionGastosDB;
GO

-- Crear tabla Usuarios
CREATE TABLE Usuarios (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    PasswordSalt NVARCHAR(255) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    NombreCompleto NVARCHAR(100) NULL
);

-- Crear tabla Categorias
CREATE TABLE Categorias (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(50) UNIQUE NOT NULL,
    Descripcion NVARCHAR(255) NULL
);

-- Crear tabla Gastos
CREATE TABLE Gastos (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UsuarioId INT NOT NULL,
    CategoriaId INT NOT NULL,
    Monto DECIMAL(18, 2) NOT NULL,
    Descripcion NVARCHAR(255) NULL,
    Fecha DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id),
    FOREIGN KEY (CategoriaId) REFERENCES Categorias(Id)
);

-- Crear tabla ArchivosXML
CREATE TABLE ArchivosXML (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UsuarioId INT NOT NULL,
    NombreArchivo NVARCHAR(255) NOT NULL,
    FechaCarga DATETIME NOT NULL DEFAULT GETDATE(),
    ContenidoXML XML NOT NULL,
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id)
);
