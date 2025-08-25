-- Script de inicialización de la base de datos para el proyecto de gestión de deudas

-- Crear la base de datos
-- Nota: Ejecutar este comando desde psql o desde una conexión que no esté conectada a la base de datos debt_manager
CREATE DATABASE debt_manager;

-- Conectar a la base de datos (este comando funciona en psql)
-- \connect debt_manager

-- Crear la extensión uuid-ossp para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear el tipo enum para el estado de las deudas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'debt_status') THEN
        CREATE TYPE debt_status AS ENUM ('pending', 'paid');
    END IF;
END $$;

-- Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla de deudas
CREATE TABLE IF NOT EXISTS debts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  creditor_id UUID NOT NULL,
  debtor_id UUID NOT NULL,
  status debt_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creditor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (debtor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_debts_creditor ON debts(creditor_id);
CREATE INDEX IF NOT EXISTS idx_debts_debtor ON debts(debtor_id);
CREATE INDEX IF NOT EXISTS idx_debts_status ON debts(status);

-- Comentarios en las tablas y columnas
COMMENT ON TABLE users IS 'Tabla que almacena la información de los usuarios';
COMMENT ON COLUMN users.id IS 'Identificador único del usuario';
COMMENT ON COLUMN users.email IS 'Correo electrónico del usuario (único)';
COMMENT ON COLUMN users.password IS 'Contraseña encriptada del usuario';
COMMENT ON COLUMN users.name IS 'Nombre del usuario (opcional)';

COMMENT ON TABLE debts IS 'Tabla que almacena las deudas entre usuarios';
COMMENT ON COLUMN debts.id IS 'Identificador único de la deuda';
COMMENT ON COLUMN debts.description IS 'Descripción de la deuda';
COMMENT ON COLUMN debts.amount IS 'Monto de la deuda';
COMMENT ON COLUMN debts.creditor_id IS 'ID del usuario acreedor (quien presta)';
COMMENT ON COLUMN debts.debtor_id IS 'ID del usuario deudor (quien debe)';
COMMENT ON COLUMN debts.status IS 'Estado de la deuda (pendiente o pagada)';
