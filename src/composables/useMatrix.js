import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import * as sdk from "matrix-js-sdk";

export function useMatrix() {
  const client = ref(null);
  const rooms = ref([]);
  const error = ref(null);

  // Аутентификация пользователя
  const login = async (homeServer, username, password) => {
    try {
      const accessToken = await sdk.createClient({ baseUrl: homeServer }).login('m.login.password', {
        user: username,
        password,
      });

      // Сохраняем данные в localStorage
      localStorage.setItem('matrixToken', accessToken.access_token);
      localStorage.setItem('matrixUserId', accessToken.user_id);
      localStorage.setItem('matrixHomeServer', homeServer);

      // Инициализируем клиент
      client.value = sdk.createClient({
        baseUrl: homeServer,
        accessToken: accessToken.access_token,
        userId: accessToken.user_id,
      });

      
      // Запускаем клиент и ждем синхронизации
      await client.value.startClient({ initialSyncLimit: 10 });
      await fetchRooms();

    } catch (err) {
      error.value = err.message;
      console.error("Ошибка аутентификации:", err.message);
    }
  };

  // Получение списка комнат
  const fetchRooms = async () => {
    if (!client.value) {
      console.error("Клиент не инициализирован");
      return;
    }

    try {
      // Ждем завершения синхронизации
      await new Promise((resolve) => {
        const onSync = (state) => {
          if (state === 'PREPARED' || state === 'SYNCING') {
            client.value.off('sync', onSync); // Отписываемся от события
            resolve();
          }
        };
        client.value.on('sync', onSync);
      });

      // Получаем комнаты
      rooms.value = Array.from(client.value.getRooms()).map((room) => {
        // Подписываемся на события комнаты для обновления данных
        room.on('Room.timeline', (event) => {
          const roomIndex = rooms.value.findIndex((r) => r.id === room.roomId);
          if (roomIndex !== -1) {
            // Обновляем lastEvent и unreadCount
            rooms.value[roomIndex].lastEvent = room.timeline[room.timeline.length - 1];
            rooms.value[roomIndex].unreadCount = room.getUnreadNotificationCount();
          }
        });
        
        console.log(rooms.value);
        
        return {
          id: room.roomId,
          name: room.name || room.canonicalAlias || room.roomId,
          lastEvent: room.timeline[room.timeline.length - 1],
          unreadCount: room.getUnreadNotificationCount(room.myUserId),
          avatarUrl: room.getAvatarUrl(window.location.origin),
        };
      });

      console.log("Комнаты загружены:", rooms.value);
    } catch (err) {
      console.error("Ошибка при загрузке комнат:", err.message);
      error.value = err.message;
    }
  };

  // Сортировка комнат
  const sortRooms = (byLastEvent = true) => {
    rooms.value.sort((a, b) => {
      if (byLastEvent) {
        return (b.lastEvent?.getTs() || 0) - (a.lastEvent?.getTs() || 0);
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  };

  // Инициализация клиента при повторном входе
  const initClient = async () => {
    const token = localStorage.getItem('matrixToken');
    const userId = localStorage.getItem('matrixUserId');
    const homeServer = localStorage.getItem('matrixHomeServer');

    if (token && userId && homeServer) {
      client.value = sdk.createClient({
        baseUrl: homeServer,
        accessToken: token,
        userId,
      });
      await client.value.startClient({ initialSyncLimit: 10 });
      await fetchRooms();
    }
  };

  // Подписываемся на события жизненного цикла компонента
  onMounted(async () => {
    await initClient();
  });

  onUnmounted(() => {
    if (client.value) {
      client.value.stopClient();
    }
  });

  // Отслеживаем изменения rooms
  watchEffect(() => {
    console.log("Комнаты обновлены:", rooms.value);
  });

  return { client, rooms, error, login, sortRooms };
}