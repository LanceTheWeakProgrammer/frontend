<template>
  <div v-if="technicianProfileStore.technician?.technician_profile" class="flex h-[calc(100vh-7rem)]">
    <!-- Sidebar for Client List -->
    <aside class="w-1/4 bg-white p-4 border-r hidden lg:flex lg:flex-col rounded-l-md">
      <h2 class="text-lg font-semibold mb-4">Chat with Clients</h2>
      <div class="flex-grow overflow-y-auto">
        <div
          v-for="client in uniqueClients"
          :key="client.user.id"
          @click="selectClient(client)"
          :class="[
            'flex items-center p-3 mb-3 rounded cursor-pointer',
            client.user.id === selectedClient?.user.id ? 'bg-rose-500 text-white' : 'hover:bg-gray-100'
          ]"
        >
          <img :src="client.profile_image ? getImageUrl(client.profile_image) : defaultAvatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3" />
          <div>
            <p class="font-semibold" :class="client.user.id === selectedClient?.user.id ? 'text-white' : 'text-gray-800'">{{ client.full_name }}</p>
            <p class="text-sm" :class="client.user.id === selectedClient?.user.id ? 'text-gray-100' : 'text-gray-500'">{{ client.user.email }}</p>
            <p class="text-xs" :class="client.user.id === selectedClient?.user.id ? 'text-gray-200' : 'text-gray-400'">Last Active: {{ client.lastOnline }}</p>
          </div>
        </div>
      </div>
    </aside>

    <Drawer v-model:visible="drawerVisible" header="Chat with Clients" class="lg:hidden" position="left" :modal="true">
      <div
        v-for="client in uniqueClients"
        :key="client.user.id"
        @click="selectClient(client)"
        :class="[
          'flex items-center p-3 mb-3 rounded cursor-pointer',
          client.user.id === selectedClient?.user.id ? 'bg-rose-500 text-white' : 'hover:bg-gray-100'
        ]"
      >
        <img :src="client.profile_image ? getImageUrl(client.profile_image) : defaultAvatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3" />
        <div>
          <p class="font-semibold" :class="client.user.id === selectedClient?.user.id ? 'text-white' : 'text-gray-800'">{{ client.full_name }}</p>
          <p class="text-sm" :class="client.user.id === selectedClient?.user.id ? 'text-gray-100' : 'text-gray-500'">{{ client.user.email }}</p>
          <p class="text-xs" :class="client.user.id === selectedClient?.user.id ? 'text-gray-200' : 'text-gray-400'">Last Active: {{ client.lastOnline }}</p>
        </div>
      </div>
    </Drawer>

    <!-- Main Chat Window -->
    <main class="flex-1 flex flex-col">
      <header class="flex items-center justify-between p-4 bg-white border-b rounded-t-md rounded-r-md h-16">
        <div class="flex items-center">
          <button @click="drawerVisible = true" class="lg:hidden text-gray-600 mr-3">
            <i class="pi pi-bars text-2xl"></i>
          </button>
          <img v-if="selectedClient" :src="selectedClient?.profile_image ? getImageUrl(selectedClient.profile_image) : defaultAvatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3" />
          <div v-if="selectedClient">
            <p class="font-semibold text-gray-800">{{ selectedClient.full_name }}</p>
            <p class="text-sm text-gray-500">Chatting with {{ selectedClient.user.email }}</p>
          </div>
        </div>
      </header>

      <!-- Messages Area -->
      <div class="flex-1 p-4 overflow-y-auto bg-gray-50 chat-area custom-scrollbar">
        <div v-if="selectedClient">
          <div 
            v-for="message in messageStore.messages" 
            :key="message.id" 
            :class="{'flex justify-end mb-4': message.sender_id === authStore.user.id, 'flex mb-4': message.sender_id !== authStore.user.id}">

            <img
              v-if="message.sender_id !== authStore.user.id"
              :src="selectedClient?.profile_image ? getImageUrl(selectedClient.profile_image) : defaultAvatar"
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
              :src="technicianProfileImage"
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

      <!-- Message Input -->
      <div class="p-4 border-t bg-white flex items-center">
        <Textarea
          v-if="selectedClient"
          autoResize
          rows="1"
          v-model="messageContent"
          @keydown="handleKeyDown"
          class="w-full py-2"
        />
        <Button v-if="selectedClient" icon="pi pi-send" text class="ml-3" @click="sendMessage" />
      </div>
    </main>
  </div>

  <div v-else class="flex h-[calc(100vh-7rem)] justify-center items-center">
      <div class="loader"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import { useTechnicianProfileStore } from '../../stores/technician.profile.store';
import { useAuthStore } from '../../stores/auth.store';
import { useMessageStore } from '../../stores/message.store';
import { useRoute } from 'vue-router';
import axios from '../../services/axios';

const technicianProfileStore = useTechnicianProfileStore();
const authStore = useAuthStore();
const messageStore = useMessageStore();

const drawerVisible = ref(false);
const selectedClient = ref(null);
const messageContent = ref("");
const defaultAvatar = 'https://via.placeholder.com/40';
const route = useRoute();

const getImageUrl = (imagePath) => `${axios.defaults.baseURL}/storage/${imagePath}`;

const uniqueClients = computed(() => {
  const clients = technicianProfileStore.technician?.technician_profile.bookings.map(booking => booking.user_profile) || [];
  const seen = new Set();
  return clients.filter(client => {
    if (seen.has(client.user.id)) {
      return false;
    }
    seen.add(client.user.id);
    return true;
  });
});

const handleKeyDown = (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault(); 
    sendMessage();
  }
};

const technicianProfileImage = computed(() => {
  return technicianProfileStore.technician?.technician_profile?.profile_image
    ? getImageUrl(technicianProfileStore.technician.technician_profile.profile_image)
    : defaultAvatar;
});


onMounted(async () => {
  await technicianProfileStore.fetchTechnicianProfile(authStore.user.id);
  if (route.params.userId) {
    selectClientById(route.params.userId);
  }
});

watch(() => selectedClient.value, (client) => {
  if (client) {
    messageStore.fetchMessages(client.user.id);
    messageStore.listenForIncomingMessages(authStore.user.id);
  }
});

const selectClient = (client) => {
  selectedClient.value = client;
};

const selectClientById = (userId) => {
  const client = uniqueClients.value.find(c => c.user.id === userId);
  if (client) {
    selectedClient.value = client;
  }
};

const sendMessage = () => {
  if (messageContent.value.trim()) {
    const formattedMessage = messageContent.value.replace(/\n/g, "<br />");
    messageStore.sendMessage(selectedClient.value.user.id, formattedMessage);
    messageContent.value = "";
  }
};
</script>

<style scoped>
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
