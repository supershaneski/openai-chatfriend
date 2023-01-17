// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        openaiApiKey: '',
        public: {
            appTitle: 'ChatFriend'
        }
    },
    css: [
        '~/assets/main.css'
    ]
})
