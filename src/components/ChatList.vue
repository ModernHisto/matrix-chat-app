<template>
  <div class="chat-list">
    <h2>Список чатов</h2>
    <div class="sort-buttons">
      <button @click="sortRoomsByLastEvent">Сортировка по последнему сообщению</button>
      <button @click="sortRoomsByName">Сортировка по имени</button>
    </div>
    
    <ul v-if="rooms.length > 0">
      <li
        v-for="room in rooms"
        :key="room.id"
        @click="selectRoom(room.id)"
        :class="{ unread: room.unreadCount > 0 }"
      >
        <img
          loading="lazy"
          v-if="room.avatarUrl"
          :src="room.avatarUrl"
          alt="Аватар"
          class="avatar"
        />
        <div class="room-info">
          <strong>{{ room.name }}</strong>
          <span class="last-message">
            {{ room.lastEvent?.content?.body || 'Нет сообщений' }}
          </span>
          <span v-if="room.unreadCount > 0" class="unread-count">
            Непрочитанных: {{ room.unreadCount }}
          </span>
        </div>
      </li>
    </ul>
    <p v-else>Нет доступных чатов</p>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useMatrix } from '../composables/useMatrix.js';
export default {
  setup() {
    const { rooms, sortRooms, error } = useMatrix();
    
    const sortRoomsByLastEvent = () => sortRooms(true);
    const sortRoomsByName = () => sortRooms(false);

    const selectRoom = (roomId) => {
      console.log('Выбрана комната:', roomId);
    };

    return { rooms, sortRoomsByLastEvent, sortRoomsByName, selectRoom, error };
  },
};
</script>

<style scoped>
.chat-list {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.sort-buttons {
  margin-bottom: 20px;
}

button {
  margin-right: 10px;
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

li:hover {
  background-color: #f9f9f9;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}

.room-info {
  flex: 1;
}

.room-info strong {
  display: block;
  font-size: 16px;
  margin-bottom: 5px;
}

.last-message {
  display: block;
  font-size: 14px;
  color: #666;
}

.unread-count {
  display: block;
  font-size: 12px;
  color: #ff0000;
  margin-top: 5px;
}

.unread {
  background-color: #e6f7ff;
}

.error-message {
  color: #ff0000;
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}
</style>