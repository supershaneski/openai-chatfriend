<script setup>

import logo from '@/assets/nuxt-icon-primary.svg'
import play from '@/assets/play.svg'

const config = useRuntimeConfig()

const siteTitle = ref(config.public.appTitle)
const inputMessage = ref("")
const chatMessages = ref([])
const chatPanel = ref(null)

let synth = null

/* lifecycle hooks */
onMounted(() => {

    synth = window.speechSynthesis;

})

/* watch */
watch(chatMessages.value, () => {
    scrollToBottom()
})

/* computed */
const isPlayEnabled = computed(() => {
    return synth !== null
})

/* methods */
function scrollToBottom() {
    setTimeout(() => {
        chatPanel.value.scrollTop = chatPanel.value.scrollHeight
    }, 200)
}

async function speakMessage(msg) {

    if(!synth) return

    if(msg.length === 0 || msg == "") return

    const utterThis = new SpeechSynthesisUtterance(msg);
    
    const voices = synth.getVoices();
    for (const voice of voices) {
        if (voice.name === "Google 日本語") {
            utterThis.voice = voice;
        }
    }

    utterThis.pitch = 1.1;
    utterThis.rate = 1.0;

    synth.speak(utterThis);
    
}

async function sendMessage() {
    
    const message = inputMessage.value
    inputMessage.value = ""

    let newUserItem = { type: 0, text: message, dateTime: (new Date()).toISOString() }
    chatMessages.value.push(newUserItem)
    
    const response = $fetch('/api/chat', {
        method: 'post',
        body: { message }
    })
    const result = await response
    
    const replyMessage = result.text
    let newFriendItem = { type: 1, text: result.text, dateTime: (new Date()).toISOString() }
    chatMessages.value.push(newFriendItem)
    
    speakMessage(replyMessage)

}

function handlePlayClick(n) {
    
    const msg = chatMessages.value[n]

    speakMessage(msg.text)

}
</script>

<template>
    <div class="container">
        <div class="main">
            <div class="header">
                <img class="logo" :src="logo" alt="nuxt logo" />
                <h1 class="header-title">{{ siteTitle }}</h1>
            </div>
            
            <div class="chat">
                <div ref="chatPanel" class="chat-panel">
                    <div class="message" v-for="(msg, i) in chatMessages" :key="i">
                        <div class="message-text">
                            <p>{{ msg.text }}</p>
                            <img @click="handlePlayClick(i)" v-if="msg.type === 1 && isPlayEnabled" class="play-button" :src="play" alt="play button" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="control">
                <div class="control-panel">
                    <textarea class="text-input" v-model="inputMessage" placeholder="Write message..."></textarea>
                    <button class="button-send" @click="sendMessage" :disabled="!inputMessage">Send</button>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.container {
    position: relative;
    height: 100vh;
    box-sizing: border-box;
    overflow-y: hidden;
}
.main {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    box-sizing: border-box;
}
.header {
    position: relative;
    height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.header-title {
    font-size: 1.1rem;
    margin-left: 0.5rem;
    opacity: 0.8;
}
.logo {
    position: relative;
    width: 28px;
    height: auto;
    margin-left: 1rem;
}
.chat {
    position: relative;
    height: calc(100% - 180px);
    padding: 1rem;
    box-sizing: border-box;
}
.chat-panel {
    position: relative;
    height: 100%;
    overflow-y: auto;
}
.message {
    margin-bottom: 0.5rem;
    display: flex;
}
.message:nth-child(odd) {
    justify-content: flex-end;
}

.message:nth-child(odd) .message-text {
    max-width: calc(100% - 5rem);
}
.message:nth-child(even) .message-text {
    max-width: calc(100% - 8rem);
    color: var(--color-text-green);
    display: flex;
    justify-content: space-between;
}
.message:last-child {
    margin-bottom: 0;
}
.message .message-text {
    background-color: var(--color-border);
    border-radius: 2rem;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
}
.play-button {
    border-radius: 50%;
    cursor: pointer;
    width: 24px;
    height: auto;
    margin-left: 0.75rem;
}

.control {
    position: relative;
    height: 130px;
    padding: 1rem;
}
.control-panel {
    position: relative;
    display: flex;
    justify-content: space-between;
}
.text-input {
    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
      Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-size: 1rem;
    width: calc(100% - 80px - 1rem);
    background-color: transparent;
    border-color: var(--color-border);
    outline: none;
    padding: 0.5rem;
    box-sizing: border-box;
    color: var(--color-text);
}
.text-input::placeholder {
    color: var(--color-text-light);
}
.button-send {
    font-size: 1rem;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    outline: none;
}
</style>