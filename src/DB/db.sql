CREATE TABLE public.rol (
    id_rol serial PRIMARY KEY NOT NULL,
    nombre_tipo text NOT NULL,
    CONSTRAINT rol_pkey PRIMARY KEY (id_rol)
);
INSERT INTO rol (nombre_tipo) 
VALUES ('Administrador'),('empleado');



CREATE TABLE public.usuario (
    id_empleado serial PRIMARY KEY NOT NULL,
    nombre_empleado text NOT NULL,
    apellido_empleado text NOT NULL,
    usuario_empleado text NOT NULL,
    contraseña_empleado text NOT NULL,
    id_rol integer NOT NULL,
    CONSTRAINT usuario_pkey PRIMARY KEY (id_empleado)
);

INSERT INTO usuario 
(nombre_empleado,apellido_empleado, usuario_empleado,contrasena_empleado,id_rol)
VALUES
('Diego','Duran','Diego1','hola',1);

