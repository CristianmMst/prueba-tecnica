# Prueba Técnica: Sistema de Pedidos, Inventario y Entregas

Este proyecto es un sistema distribuido compuesto por tres microservicios escritos en TypeScript/Node.js, que se comunican a través de RabbitMQ. Cada servicio está dockerizado y orquestado mediante Docker Compose.

## Arquitectura

- **order-service**: expone una API REST para crear pedidos y consultar entregas.
- **inventory-service**: valida el stock de los pedidos recibidos y responde si hay disponibilidad.
- **delivery-service**: gestiona la entrega de los pedidos validados.
- **RabbitMQ**: broker de mensajería para la comunicación entre servicios.

## Estructura del Proyecto

```
prueba-tecnica/
├── docker-compose.yml
├── order-service/
├── inventory-service/
└── delivery-service/
```

Cada servicio contiene su propio `Dockerfile`, código fuente en `src/`, y scripts de ejecución en `package.json`.

## Requisitos

- Docker y Docker Compose
- (Opcional para desarrollo local) Node.js >= 18, pnpm

## Ejecución con Docker Compose

1. Clona el repositorio y entra al directorio raíz.
2. Ejecuta:
   ```sh
   docker compose up --build
   ```
3. Los servicios estarán disponibles en los siguientes puertos:
   - order-service: http://localhost:3001
   - inventory-service: http://localhost:3002
   - delivery-service: http://localhost:3003
   - RabbitMQ UI: http://localhost:15672 (usuario: admin, contraseña: admin123)

## Endpoints principales

- **POST /create_order** (order-service):
  - Crea un pedido. Ejemplo de body:
    ```json
    {
      "item": "producto1",
      "quantity": 2
    }
    ```
- **GET /deliveries** (order-service):
  - Lista las entregas procesadas.

## Flujo de mensajes

1. `order-service` recibe un pedido y lo envía a `inventory-service` vía RabbitMQ.
2. `inventory-service` valida el stock y responde al `order-service` y, si hay stock, notifica a `delivery-service`.
3. `delivery-service` procesa la entrega y notifica al `order-service`.

## Desarrollo local (sin Docker)

Cada servicio puede ejecutarse individualmente:

1. Instala dependencias (en cada carpeta):
   ```sh
   pnpm install
   ```
2. Ejecuta en modo desarrollo:
   ```sh
   pnpm dev
   ```
   > Asegúrate de tener RabbitMQ corriendo localmente (puedes usar el contenedor de Docker Compose solo para RabbitMQ).

## Pruebas

Actualmente, el proyecto no incluye pruebas automatizadas. Puedes probar el flujo usando herramientas como Postman o curl para consumir el endpoint `/create_order` y observar los logs de los servicios.

## Notas

- El sistema es solo demostrativo y no implementa persistencia de datos.

---

**Autor:** [Cristian Mora Moreno]
