# montilabs.cl

Sitio de Montilabs: onboarding corporativo, video y experiencias UX/UI. Santiago, Chile.

HTML estático publicado en GitHub Pages (detrás de Cloudflare) con cada push a `main`.

## Estructura

- `index.html`: home
- `fintech/`: Tutorial Banca Digital
- `privacy.html`, `terms.html`, `404.html`
- `assets/fonts/`: IBM Plex Sans y Mono
- `assets/screenshots/`: capturas de proyectos
- `logo/`: favicons PNG, banners e ícono de YouTube
- `videos/fintech-video/`: fuente HyperFrames del tutorial (no se publica)

## Deploy

[.github/workflows/deploy.yml](.github/workflows/deploy.yml) copia solo los archivos públicos a `_site/` y los publica. Si agregas una página o carpeta nueva, súmala a la lista de `cp` de ese workflow.

## Ver en local

```sh
python3 -m http.server 8000
```
