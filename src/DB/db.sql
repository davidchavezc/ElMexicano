
INSERT INTO rol (nombre_tipo) 
VALUES ('Administrador'),('empleado');


INSERT INTO usuario 
(nombre_empleado,apellido_empleado, usuario_empleado,contrasena_empleado,id_rol)
VALUES
('Diego','Duran','Diego1','hola',1);

INSERT INTO usuario 
(nombre_empleado,apellido_empleado, usuario_empleado,contrasena_empleado,id_rol)
VALUES
('David','Chavez','David1','hola',2);


INSERT INTO marcas
(nombre_marca)
VALUES('Toyota');

INSERT INTO pieza 
(nombre_pieza,id_modelo,id_marca,id_categoria,cantidad)
VALUES('MotorCamry',1,1,1,1);

INSERT INTO categoria
(nombre_categoria)
VALUES('Motores');

