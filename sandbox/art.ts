// Imagens de exemplo geradas localmente, para o sandbox não depender de rede.
const svg = (body: string, w: number, h: number) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`)}`

export const portrait = (color: string, initials: string) =>
  svg(`<rect width="96" height="96" fill="${color}"/><text x="48" y="60" font-family="Poppins,sans-serif" font-size="34" font-weight="600" fill="#fff" text-anchor="middle">${initials}</text>`, 96, 96)

export const banner = (from: string, to: string, label: string) =>
  svg(`<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="960" height="540" fill="url(#g)"/><circle cx="780" cy="110" r="190" fill="#fff" fill-opacity=".1"/><circle cx="130" cy="480" r="150" fill="#fff" fill-opacity=".08"/><text x="60" y="290" font-family="Poppins,sans-serif" font-size="56" font-weight="600" fill="#fff">${label}</text>`, 960, 540)
