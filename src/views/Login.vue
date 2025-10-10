<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md p-6 bg-white rounded shadow">
      <h2 class="text-xl font-semibold mb-4">Login</h2>
      <form @submit.prevent="onLogin">
        <label class="block">Token</label>
        <input v-model="tokenInput" class="w-full p-2 border rounded mt-1" />
        <div class="mt-4">
          <button class="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter, useRoute } from 'vue-router'

export default {
  setup() {
    const store = useUserStore()
    const router = useRouter()
    const route = useRoute()
    const tokenInput = ref('')

    function onLogin() {
      if (!tokenInput.value) return
      store.setToken(tokenInput.value)
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    }

    return { tokenInput, onLogin }
  }
}
</script>
