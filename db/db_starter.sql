CREATE TABLE IF NOT EXISTS public.categoria
(
    id_categoria integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    nombre text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT categoria_pkey PRIMARY KEY (id_categoria)
);

CREATE TABLE IF NOT EXISTS public.detalle_venta
(
    id_venta integer NOT NULL,
    id_pieza integer NOT NULL,
    cantidad integer NOT NULL,
    subtotal numeric NOT NULL,
    CONSTRAINT detalle_venta_pkey PRIMARY KEY (id_venta, id_pieza)
);

CREATE TABLE IF NOT EXISTS public.marcas
(
    id_marca integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    nombre_marca text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT marcas_pkey PRIMARY KEY (id_marca)
);

CREATE TABLE IF NOT EXISTS public.metodo_pago
(
    id_metodopago integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    nombre_metodopago text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT metodo_pago_pkey PRIMARY KEY (id_metodopago)
);

CREATE TABLE IF NOT EXISTS public.modelos
(
    id_modelo integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    nombre_modelo text COLLATE pg_catalog."default" NOT NULL,
    "año_modelo" integer NOT NULL,
    CONSTRAINT modelos_pkey PRIMARY KEY (id_modelo)
);

CREATE TABLE IF NOT EXISTS public.pieza
(
    id_pieza integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    nombre_pieza text COLLATE pg_catalog."default" NOT NULL,
    id_modelo integer NOT NULL,
    id_marca integer NOT NULL,
    id_categoria integer,
    cantidad integer,
    CONSTRAINT pieza_pkey PRIMARY KEY (id_pieza)
);

CREATE TABLE IF NOT EXISTS public.rol
(
    id_rol integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    nombre_tipo text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT rol_pkey PRIMARY KEY (id_rol)
);

CREATE TABLE IF NOT EXISTS public.usuario
(
    id_empleado integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    nombre_empleado text COLLATE pg_catalog."default" NOT NULL,
    apellido_empleado text COLLATE pg_catalog."default" NOT NULL,
    usuario_empleado text COLLATE pg_catalog."default" NOT NULL,
    contrasena_empleado text COLLATE pg_catalog."default" NOT NULL,
    id_rol integer NOT NULL,
    CONSTRAINT usuario_pkey PRIMARY KEY (id_empleado)
);

CREATE TABLE IF NOT EXISTS public.venta
(
    id_venta integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    id_empleado integer NOT NULL,
    fecha_hora timestamp without time zone NOT NULL,
    monto numeric NOT NULL,
    id_metodopago integer NOT NULL,
    nombre_cliente text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT venta_pkey PRIMARY KEY (id_venta)
);

ALTER TABLE IF EXISTS public.detalle_venta
    ADD CONSTRAINT detalle_venta_id_pieza_fkey FOREIGN KEY (id_pieza)
    REFERENCES public.pieza (id_pieza) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.detalle_venta
    ADD CONSTRAINT detalle_venta_id_venta_fkey FOREIGN KEY (id_venta)
    REFERENCES public.venta (id_venta) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.pieza
    ADD CONSTRAINT pieza_id_categoria_fkey FOREIGN KEY (id_categoria)
    REFERENCES public.categoria (id_categoria) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.pieza
    ADD CONSTRAINT pieza_id_marca_fkey FOREIGN KEY (id_marca)
    REFERENCES public.marcas (id_marca) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.pieza
    ADD CONSTRAINT pieza_id_modelo_fkey FOREIGN KEY (id_modelo)
    REFERENCES public.modelos (id_modelo) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.usuario
    ADD CONSTRAINT usuario_id_rol_fkey FOREIGN KEY (id_rol)
    REFERENCES public.rol (id_rol) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.usuario
    ADD CONSTRAINT usuario_empleado UNIQUE (usuario_empleado);

ALTER TABLE IF EXISTS public.venta
    ADD CONSTRAINT venta_id_empleado_fkey FOREIGN KEY (id_empleado)
    REFERENCES public.usuario (id_empleado) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.venta
    ADD CONSTRAINT venta_id_metodopago_fkey FOREIGN KEY (id_metodopago)
    REFERENCES public.metodo_pago (id_metodopago) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;