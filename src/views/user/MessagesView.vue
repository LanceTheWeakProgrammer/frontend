<template>
  <div v-if="userProfileStore.user?.profile" class="flex h-[calc(100vh-4.1rem)]">
    <aside class="w-1/4 bg-white p-4 border-r hidden lg:flex lg:flex-col rounded-l-md">
      <h2 class="text-lg font-semibold mb-4">Chat with Technicians</h2>
      <div class="flex-grow overflow-y-auto">
        <div
          v-for="technician in uniqueTechnicians"
          :key="technician.user.id"
          @click="selectTechnician(technician)"
          :class="[
            'flex items-center p-3 mb-3 rounded cursor-pointer',
            technician.user.id === selectedTechnician?.user.id ? 'bg-rose-500 text-white' : 'hover:bg-gray-100'
          ]"
        >
          <img :src="technician.profile_image ? getImageUrl(technician.profile_image) : defaultAvatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3" />
          <div>
            <p class="font-semibold" :class="technician.user.id === selectedTechnician?.user.id ? 'text-white' : 'text-gray-800'">{{ technician.full_name }}</p>
            <p class="text-sm" :class="technician.user.id === selectedTechnician?.user.id ? 'text-gray-100' : 'text-gray-500'">{{ technician.user.email }}</p>
            <p class="text-xs" :class="technician.user.id === selectedTechnician?.user.id ? 'text-gray-200' : 'text-gray-400'">
              Last Active: {{
                technician.user.logged_in_at
                  ? new Intl.DateTimeFormat('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    }).format(new Date(technician.user.logged_in_at))
                  : 'N/A'
              }}
            </p>
          </div>
        </div>
      </div>
    </aside>

    <Drawer v-model:visible="drawerVisible" header="Chat with Technicians" class="lg:hidden" position="left" :modal="true">
      <div
        v-for="technician in uniqueTechnicians"
        :key="technician.user.id"
        @click="selectTechnician(technician)"
        :class="[
          'flex items-center p-3 mb-3 rounded cursor-pointer',
          technician.user.id === selectedTechnician?.user.id ? 'bg-rose-500 text-white' : 'hover:bg-gray-100'
        ]"
      >
        <img :src="technician.profile_image ? getImageUrl(technician.profile_image) : defaultAvatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3" />
        <div>
          <p class="font-semibold" :class="technician.user.id === selectedTechnician?.user.id ? 'text-white' : 'text-gray-800'">{{ technician.full_name }}</p>
          <p class="text-sm" :class="technician.user.id === selectedTechnician?.user.id ? 'text-gray-100' : 'text-gray-500'">{{ technician.user.email }}</p>
          <p class="text-xs" :class="technician.user.id === selectedTechnician?.user.id ? 'text-gray-200' : 'text-gray-400'">Last Active: {{ technician.user.logged_in_at }}</p>
        </div>
      </div>
    </Drawer>

    <main class="flex-1 flex flex-col">
      <header class="flex items-center justify-between p-4 bg-white border-b rounded-t-md rounded-r-md h-16">
        <div class="flex items-center">
          <button @click="drawerVisible = true" class="lg:hidden text-gray-600 mr-3">
            <i class="pi pi-bars text-2xl"></i>
          </button>
          <img v-if="selectedTechnician" :src="selectedTechnician?.profile_image ? getImageUrl(selectedTechnician.profile_image) : defaultAvatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3" />
          <div v-if="selectedTechnician">
            <p class="font-semibold text-gray-800">{{ selectedTechnician.full_name }}</p>
            <p class="text-sm text-gray-500">Chatting with {{ selectedTechnician.user.email }}</p>
          </div>
        </div>
      </header>

      <div ref="chatAreaRef" class="flex-1 p-4 overflow-y-auto bg-gray-50 chat-area custom-scrollbar" @scroll="handleScroll">
        <div v-if="loadingTechnician" class="flex items-center justify-center h-full">
          <div class="loader"></div>
        </div>

        <div v-else-if="selectedTechnician">
          <div 
            v-for="message in messageStore.messages" 
            :key="message.id" 
            :class="{'flex justify-end mb-4': message.sender_id === authStore.user.id, 'flex mb-4': message.sender_id !== authStore.user.id}">

            <img
              v-if="message.sender_id !== authStore.user.id"
              :src="selectedTechnician?.profile_image ? getImageUrl(selectedTechnician.profile_image) : defaultAvatar"
              alt="Avatar"
              class="w-10 h-10 rounded-full mr-3"
            />

            <div 
              :class="{
                'message-bubble bg-rose-500 text-white': message.sender_id === authStore.user.id,
                'message-bubble bg-gray-200 text-gray-700': message.sender_id !== authStore.user.id
              }"
              v-html="message.content"
            ></div>

            <img
              v-if="message.sender_id === authStore.user.id"
              :src="defaultAvatar"
              alt="Avatar"
              class="w-10 h-10 rounded-full ml-3"
            />
          </div>
        </div>
        <div v-else class="flex items-center justify-center align-middle">
          <div class="flex flex-col items-center">
            <img src="/chat.svg" width="300" alt="Chat Icon"> 
            <p class="text-center text-gray-500 mt-4">No message selected</p>
          </div>
        </div>
      </div>

      <div class="p-4 border-t bg-white flex items-center">
        <Textarea
          v-if="selectedTechnician"
          autoResize 
          rows="1"
          @keydown="handleKeyDown"
          v-model="messageContent"
          class="w-full py-2"
        />
        <Button v-if="selectedTechnician" icon="pi pi-send" text  class="ml-3" @click="sendMessage" />
      </div>
    </main>
  </div>
  
  <div v-else class="flex h-[calc(100vh-4rem)] justify-center items-center">
    <div class="loader"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import { useUserProfileStore } from '../../stores/user.profile.store';
import { useAuthStore } from '../../stores/auth.store';
import { useMessageStore } from '../../stores/message.store';
import { useRoute } from 'vue-router';
import axios from '../../services/axios';

const userProfileStore = useUserProfileStore();
const authStore = useAuthStore();
const messageStore = useMessageStore();

const drawerVisible = ref(false);
const selectedTechnician = ref(null);
const messageContent = ref("");
const defaultAvatar = 'https://via.placeholder.com/40';
const chatAreaRef = ref(null);
const isAtBottom = ref(true);
const loadingTechnician = ref(false);
const route = useRoute();

const getImageUrl = (imagePath) => `${axios.defaults.baseURL}/storage/${imagePath}`;

const uniqueTechnicians = computed(() => {
  const technicians = userProfileStore.user?.profile.bookings.map(booking => booking.technician) || [];
  const seen = new Set();
  return technicians.filter(technician => {
    if (seen.has(technician.user.id)) {
      return false;
    }
    seen.add(technician.user.id);
    return true;
  });
});

onMounted(async () => {
  await userProfileStore.fetchUserProfile(authStore.id);
  if (route.params.userId) {
    selectTechnicianById(route.params.userId);
  }
  nextTick(scrollToBottom);
});

watch(() => messageStore.messages, () => {
  nextTick(scrollToBottom);
});

const selectTechnician = async (technician) => {
  if (loadingTechnician.value) return;

  loadingTechnician.value = true;
  try {
    await messageStore.fetchMessages(technician.user.id);
    selectedTechnician.value = technician;
    messageStore.listenForIncomingMessages(authStore.user.id);
  } finally {
    loadingTechnician.value = false;
    nextTick(scrollToBottom);
  }
};

const selectTechnicianById = (userId) => {
  const technician = uniqueTechnicians.value.find(tech => tech.user.id === userId);
  if (technician) {
    selectTechnician(technician);
  }
};

const handleKeyDown = (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault(); 
    sendMessage();
  }
};

const scrollToBottom = () => {
  if (chatAreaRef.value && isAtBottom.value) {
    chatAreaRef.value.scrollTop = chatAreaRef.value.scrollHeight;
  }
};

const handleScroll = () => {
  if (chatAreaRef.value) {
    const { scrollTop, scrollHeight, clientHeight } = chatAreaRef.value;
    isAtBottom.value = scrollHeight - (scrollTop + clientHeight) < 10;
  }
};

const sendMessage = () => {
  if (messageContent.value.trim()) {
    const formattedMessage = messageContent.value.replace(/\n/g, "<br />");
    messageStore.sendMessage(selectedTechnician.value.user.id, formattedMessage);
    messageContent.value = "";
    nextTick(scrollToBottom);
  }
};
</script>

<style scoped>
.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 3px;
}

.chat-area {
  height: calc(100vh - 10rem);
  overflow-y: auto;
}

.message-bubble {
  max-width: 300px;
  white-space: pre-wrap;
  word-wrap: break-word; 
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}
</style>
