// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        openaiApiKey: '',
        public: {
            appTitle: 'ChatFriend',
            appMuted: process.env.NUXT_PUBLIC_APP_NOVOICE === 'true' || false,
        }
    },
    css: [
        '~/assets/main.css'
    ]
})
