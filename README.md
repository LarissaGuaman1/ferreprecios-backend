# FerrePrecios — Backend

API REST desarrollada en **Node.js + Express** que gestiona usuarios, ferreterías, materiales y reportes de precios para la app FerrePrecios.

## Tecnologías

- Node.js + Express
- MongoDB Atlas (base de datos en la nube)
- Cloudinary (almacenamiento de imágenes)
- JWT (autenticación)
- Docker + Docker Swarm (orquestación)
- GitHub Actions (CI/CD)
- GitHub Container Registry (GHCR)
- Traefik (reverse proxy y HTTPS automático)

## URLs en producción

| Servicio | URL |
|---|---|
| Backend API | https://api.ferreprecios.byronrm.com/api |
| Mongo Express | https://mongo.ferreprecios.byronrm.com |
| Portainer | https://portainer.ferreprecios.byronrm.com |

---

## Despliegue paso a paso

### 1. Requisitos previos

- VPS con Docker Swarm inicializado (`docker swarm init`)
- Traefik corriendo en el VPS con la red `traefik-public` creada
- Cuenta en MongoDB Atlas con la URI de conexión
- Cuenta en Cloudinary con las credenciales de API

### 2. Crear el archivo .env en el VPS

Conéctate al VPS por SSH y crea el archivo de variables de entorno:

```bash
mkdir -p ~/ferre-precios-backend
nano ~/ferre-precios-backend/.env
```

Contenido del `.env`:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ferreprecios
JWT_SECRET=tu_clave_secreta_segura
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

> **IMPORTANTE:** Este archivo nunca debe subirse al repositorio. Está en `.gitignore`.

### 3. Configurar la red de Traefik en el VPS

Ejecuta una sola vez en el VPS:

```bash
docker network create --driver overlay traefik-public
```

### 4. Configurar secrets en GitHub

Ve a **Settings → Secrets and variables → Actions** del repositorio y agrega:

| Secret | Descripción |
|---|---|
| `GHCR_TOKEN` | Personal Access Token con permisos `write:packages` y `read:packages` |
| `VPS_HOST` | IP del VPS (ej. `46.224.5.181`) |
| `VPS_USER` | Usuario SSH del VPS (ej. `larissa`) |
| `VPS_PORT` | Puerto SSH (generalmente `22`) |
| `VPS_PASSWORD` | Contraseña SSH del VPS |

#### Cómo crear el GHCR_TOKEN

1. GitHub → foto de perfil → **Settings**
2. **Developer settings → Personal access tokens → Tokens (classic)**
3. **Generate new token (classic)**
4. Marcar: `write:packages`, `read:packages`, `delete:packages`
5. Sin fecha de expiración (No expiration)
6. Copiar el token y pegarlo como secret `GHCR_TOKEN`

### 5. Despliegue automático del backend (GitHub Actions)

Cada vez que haces `git push` a `main`, el workflow `.github/workflows/deploy.yml` ejecuta:

1. Construye la imagen Docker del backend
2. La publica en GHCR: `ghcr.io/larissaguaman1/backend-ferreprecios:latest`
3. Copia `stack.yml` y `Makefile` al VPS vía SCP
4. Conecta al VPS por SSH, carga el `.env` y ejecuta `docker stack deploy`

### 6. Desplegar Mongo Express (manual, una sola vez)

Mongo Express no tiene CI/CD propio. Despliégalo manualmente desde el VPS:

```bash
# Crear el stack file en el VPS
cat > ~/ferreprecios-deploy/mongo-express-stack.yml << 'EOF'
# (contenido del archivo mongo-express-stack.yml del repositorio)
EOF

# Cargar variables y desplegar
set -a && . ~/ferre-precios-backend/.env && set +a
docker stack deploy -c ~/ferreprecios-deploy/mongo-express-stack.yml mongo-express
```

Acceso: https://mongo.ferreprecios.byronrm.com  
Usuario: `admin` | Contraseña: `ferreprecios2025`

### 7. Desplegar Portainer (manual, una sola vez)

```bash
# Crear el stack file en el VPS
cat > ~/ferreprecios-deploy/portainer-stack.yml << 'EOF'
# (contenido del archivo portainer-stack.yml del repositorio)
EOF

docker stack deploy -c ~/ferreprecios-deploy/portainer-stack.yml portainer
```

Acceso: https://portainer.ferreprecios.byronrm.com  
(Crea el usuario administrador la primera vez que ingresas)

### 8. Redesplegar todo manualmente (si los stacks se caen)

```bash
set -a && . ~/ferre-precios-backend/.env && set +a

cd ~/ferreprecios-deploy

# Backend
docker pull ghcr.io/larissaguaman1/backend-ferreprecios:latest
docker stack deploy -c stack.yml ferreprecios

# Frontend
docker stack deploy -c ~/ferreprecios-web-deploy/stack.yml ferreprecios-web

# Mongo Express
docker stack deploy -c mongo-express-stack.yml mongo-express

# Portainer
docker stack deploy -c portainer-stack.yml portainer
```

### 9. Verificar que todos los servicios están corriendo

```bash
docker service ls
```

Todos los servicios deben mostrar `1/1` en la columna REPLICAS.

---

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Crear .env local con las mismas variables que el VPS
cp .env.example .env  # editar con tus valores

# Iniciar servidor en modo desarrollo
npm run dev
# Servidor disponible en http://localhost:3000
```

---

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/registro` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/materiales` | Listar materiales |
| GET | `/api/materiales/:id/precios` | Precios de un material |
| GET | `/api/ferreterias` | Listar ferreterías |
| PUT | `/api/ferreterias/mia` | Guardar datos de mi ferretería |
| POST | `/api/ferreterias/mia/catalogo` | Importar catálogo CSV |
| POST | `/api/reportes` | Crear reporte de precio |
| DELETE | `/api/reportes/:id` | Eliminar propio reporte |
| GET | `/api/usuarios/me` | Ver perfil del usuario |
| PUT | `/api/usuarios/me/nombre` | Actualizar nombre |
| PUT | `/api/usuarios/me/foto` | Actualizar foto de perfil |

---

## Formato del CSV para importar catálogo

El separador es `;` (punto y coma). La primera fila es el encabezado y se ignora.

```
nombre;marca;precio;unidad;categoria;caracteristicas
Cemento Portland;Selva Alegre;8.50;saco 50kg;Cementos;Tipo GU
Varilla corrugada 8mm;Adelca;1.85;metro;Hierro y Acero;Grado 60
Pintura de caucho;Cóndor;12.50;galón;Pinturas;Lavable interior
```

Campos obligatorios: `nombre`, `marca`, `precio`, `unidad`  
Campos opcionales: `categoria` (por defecto "General"), `caracteristicas`
