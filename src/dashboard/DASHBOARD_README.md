# Dashboard Module - Documentación

Módulo de dashboard para la aplicación de finanzas personales con análisis de sobres y transacciones.

## Endpoints

### GET /dashboard
Dashboard completo con todos los datos

### GET /dashboard/envelopes/summary
Resumen general de sobres

### GET /dashboard/envelopes/detail
Detalle de cada sobre con entradas/salidas

### GET /dashboard/transfers/summary
Resumen de transferencias entre sobres

### GET /dashboard/transfers/recent
Transferencias recientes

### GET /dashboard/totals
Totales por tipo de transacción

### GET /dashboard/transactions/recent
Transacciones recientes

## Filtros Disponibles
- startDate, endDate
- period (day/week/month/year/custom)
- categoryId, envelopeId
