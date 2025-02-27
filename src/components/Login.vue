<template>
  <div class="login">
    <h2>Вход</h2>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="homeServer">Домашний сервер:</label>
        <input
          v-model="homeServer"
          id="homeServer"
          type="text"
          placeholder="https://matrix.org"
          required
        />
      </div>

      <div class="form-group">
        <label for="username">Логин:</label>
        <input
          v-model="username"
          id="username"
          type="text"
          placeholder="Ваш логин"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Пароль:</label>
        <input
          v-model="password"
          id="password"
          type="password"
          placeholder="Ваш пароль"
          required
        />
      </div>

      <button type="submit" class="submit-button">Войти</button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useMatrix } from '../composables/useMatrix';
import router from '../router';

export default {
  setup() {
    const { login, error } = useMatrix();
    const homeServer = ref('https://converser.eu');
    const username = ref('TestyTestovich');
    const password = ref('zxcdsaqwe321');

    const handleLogin = async () => {
      await login(homeServer.value, username.value, password.value);
      if (!error.value) {
        router.push('/chats'); // Перенаправление на страницу чатов
      }
    };

    return { homeServer, username, password, error, handleLogin };
  },
};
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: 500;
  color: #555;
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #007bff;
}

.submit-button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #ff0000;
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}
</style>