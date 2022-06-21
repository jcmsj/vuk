import { VitePWA } from 'vite-plugin-pwa'

/**
 * A custom config of VitePWA
 */
const vitePWA = VitePWA({
    registerType: 'prompt',
    manifest: {
        "name": "Vuk",
        "background_color": "white",
        "theme_color": "#FFFFFF",
        "icons": [
            {
                "src": "/vuk.webp",
                "sizes": "512x512",
                "type": "image/webp"
            },
            {
                "src": "/vuk-t.png",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "maskable"
            },
            {
                "src": "/vuk-p.png",
                "sizes": "512x512",
                "type": "image/png",
            },
            {
                "src": "/favicon.ico",
                "sizes": "128x128",
            }
        ],
        "file_handlers": [
            {
                "action": "/open-epub",
                "launch_type": "single-client",
                "accept": {
                    "application/epub+zip": [".epub"],
                },
                "icons": [{
                    "src": "favicon.ico",
                    "sizes": "128x128",
                    "type": "image/png"
                }]
            }
        ]
    }
})

export default vitePWA