-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 06-07-2020 a las 22:49:39
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dds`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bonos`
--

CREATE TABLE `bonos` (
  `id` int(10) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `precioCompra` int(10) NOT NULL,
  `precioPago` int(10) NOT NULL,
  `vencimiento` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `bonos`
--

INSERT INTO `bonos` (`id`, `nombre`, `precioCompra`, `precioPago`, `vencimiento`) VALUES
(1, 'ESFE2020', 20, 30, '2020-12-31'),
(2, 'ESFE2021', 20, 60, '2021-12-31'),
(3, 'ESFE2022', 20, 90, '2022-12-31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `usuario` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `nombre`, `direccion`, `usuario`, `password`) VALUES
(16, 'Federico Toledo', 'Av Parque 200', 'fedetoledo', '12345'),
(18, 'Vladimir Leal', 'Zarate?', 'vladileal', '12345'),
(19, 'Mateo Ryser', 'Altos de Campo Grande?', 'mateoryser', '12345'),
(20, 'Sergio Viera', 'Campana?', 'sergioviera', '12345');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuentas`
--

CREATE TABLE `cuentas` (
  `id` int(11) NOT NULL,
  `aliasCuenta` varchar(17) NOT NULL,
  `saldo` float NOT NULL DEFAULT 0,
  `idCliente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `cuentas`
--

INSERT INTO `cuentas` (`id`, `aliasCuenta`, `saldo`, `idCliente`) VALUES
(14, 'FEDE.TOLEDO.ADMIN', 3004, 16),
(18, 'BANCO.FVM.BONOS', 50002600, 0),
(24, 'SERGIO.VIERA.USER', 1000000000, 20),
(25, 'MATEO.RYSER.ADMIN', 502500, 19),
(26, 'VLADI.LEAL.ADMIN', 486900, 18);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inversiones`
--

CREATE TABLE `inversiones` (
  `id` int(11) NOT NULL,
  `cantidadTitulos` int(11) NOT NULL,
  `idTitulo` int(11) NOT NULL,
  `idCliente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `inversiones`
--

INSERT INTO `inversiones` (`id`, `cantidadTitulos`, `idTitulo`, `idCliente`) VALUES
(21, 20, 1, 18),
(22, 10, 3, 18),
(23, 100, 3, 16);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transacciones`
--

CREATE TABLE `transacciones` (
  `id` int(11) NOT NULL,
  `cuentaOrigen` int(11) NOT NULL,
  `cuentaDestino` int(11) NOT NULL,
  `monto` float NOT NULL,
  `tipoTransaccion` int(11) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `transacciones`
--

INSERT INTO `transacciones` (`id`, `cuentaOrigen`, `cuentaDestino`, `monto`, `tipoTransaccion`, `fecha`) VALUES
(116, 25, 14, 10000, 0, '2020-07-03'),
(117, 26, 25, 12500, 0, '2020-07-03'),
(118, 26, 18, 400, 2, '2020-07-03'),
(119, 26, 18, 200, 2, '2020-07-03'),
(120, 14, 24, 5000, 0, '2020-07-03'),
(121, 14, 18, 2000, 2, '2020-07-03');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bonos`
--
ALTER TABLE `bonos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cuentas`
--
ALTER TABLE `cuentas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `inversiones`
--
ALTER TABLE `inversiones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `transacciones`
--
ALTER TABLE `transacciones`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bonos`
--
ALTER TABLE `bonos`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `cuentas`
--
ALTER TABLE `cuentas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `inversiones`
--
ALTER TABLE `inversiones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `transacciones`
--
ALTER TABLE `transacciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
