// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        openaiApiKey: '',
        public: {
            appTitle: 'ChatFriend',
            appMuted: Boolean(process.env.NUXT_PUBLIC_APP_MUTED) || false,
        }
    },
    css: [
        '~/assets/main.css'
    ]
})
