<script setup>
import friendList from '../assets/friends-list.json'

import logo from '@/assets/nuxt-icon-primary.svg'
import play from '@/assets/play.svg'

const config = useRuntimeConfig()

const textRef = ref(null)

const siteTitle = ref(config.public.appTitle)
const inputMessage = ref("")
const chatMessages = ref([])
const chatPanel = ref(null)
const selectedBot = ref('JPN1')

let synth = null

onMounted(() => {

    synth = window.speechSynthesis;

})

watch(chatMessages.value, () => {

    scrollToBottom()

})

watch(selectedBot, () => {
    
    chatMessages.value = []

})

const isPlayEnabled = computed(() => {


    console.log('global muted', config.public.appMuted)
    
    let globalMute = config.public.appMuted || false
    if(globalMute) return false

    let friend = friendList.friends.find((item) => item.id === selectedBot.value)
    if(!friend) return false

    console.log(friend.name, !(friend?.voice))

    return !(friend?.voice) ? false : true
})

function scrollToBottom() {

    console.log("scroll...")

    setTimeout(() => {
        chatPanel.value.scrollTop = chatPanel.value.scrollHeight
    }, 200)
}

function handleKeyDown(event) {
    if(inputMessage.value.length > 140) { // twitter old char limit
        inputMessage.value = inputMessage.value.substr(0, 140)
        event.preventDefault()
    }
}

async function speakMessage(msg) {

    if(!synth) return

    if(msg.length === 0 || msg == "") return

    let globalMute = config.public.appMuted || false
    if(globalMute) return

    let friend = friendList.friends.find((item) => item.id === selectedBot.value)
    if(!friend) return

    if(friend.mute || !(friend?.voice)) return

    console.log("speak")

    const utterThis = new SpeechSynthesisUtterance(msg)
    
    const voices = synth.getVoices();
    for (const voice of voices) {
        if (voice.name === friend.voice) {
            utterThis.voice = voice;
        }
    }

    utterThis.pitch = friend.pitch || 1.0
    utterThis.rate = friend.rate || 1.0

    synth.speak(utterThis);
    
}

async function sendMessage() {
    
    textRef.value.blur()

    const message = inputMessage.value
    inputMessage.value = ""

    const isReset = chatMessages.value.length === 0 ? true : false

    let newUserItem = { type: 0, text: message, dateTime: (new Date()).toISOString() }
    chatMessages.value.push(newUserItem)
    
    const response = $fetch('/api/chat', {
        method: 'post',
        body: { message, bot: selectedBot.value, reset: isReset }
    })
    const result = await response
    
    const replyMessage = result.text
    if(replyMessage) {

        let newFriendItem = { type: 1, text: replyMessage, dateTime: (new Date()).toISOString() }
        chatMessages.value.push(newFriendItem)
        
        speakMessage(replyMessage)

        textRef.value.focus()

    }

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
                <div class="banner">
                    <img class="logo" :src="logo" alt="nuxt logo" />
                    <h1 class="header-title">{{ siteTitle }}</h1>
                </div>
                <div class="room-select">
                    <select class="select" v-model="selectedBot">
                        <option v-for="(friend) in friendList.friends" :key="friend.id" :value="friend.id">{{ friend.name }}</option>
                    </select>
                </div>
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
                    <textarea ref="textRef" class="text-input" v-on:keyup.enter="sendMessage" @keydown="handleKeyDown($event)" v-model="inputMessage" placeholder="Write message..."></textarea>
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
.container::-webkit-scrollbar {
    display: none;
}
.main {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    box-sizing: border-box;
}
.main::-webkit-scrollbar {
    display: none;
}
.header {
    position: relative;
    height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.banner {
    display: flex;
    margin-left: 1rem;
}
.room-select {
    margin-left: 1rem;
}
.select {
    background-color: transparent;
    border: 1px solid var(--color-border);
    border-radius: 3rem;
    font-size: 1rem;
    color: var(--color-text-green);
    height: 2rem;
    outline: none;
}
.header-title {
    font-size: 1.1rem;
    opacity: 0.8;
    margin-left: 0.5rem;
}
.logo {
    position: relative;
    width: 28px;
    height: auto;
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
.chat-panel::-webkit-scrollbar {
    display: none;
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
    border-radius: 0.5rem;
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