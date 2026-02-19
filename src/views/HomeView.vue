<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const PENDING_GATE_KEY = 'groomsmen:v2:pendingGateChoice'

function startWithChoice(choice: 'yes' | 'no') {
  localStorage.setItem(PENDING_GATE_KEY, choice)
  router.push({
    name: 'story',
    params: { friend: 'friend' },
    query: route.query
  })
}
</script>

<template>
  <section class="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
    <div class="w-full max-w-xl rounded-xl border border-zinc-700 bg-zinc-900/70 p-8 text-center">
      <h1 class="mb-3 text-3xl font-semibold">Do you want to play a game?</h1>
      <div class="flex items-center justify-center gap-3">
        <button
          type="button"
          class="inline-flex rounded-md border border-red-500/80 bg-red-700/20 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-red-100 transition hover:bg-red-700/35"
          @click="startWithChoice('yes')"
        >
          Yes
        </button>
        <button
          type="button"
          class="inline-flex rounded-md border border-zinc-500 bg-zinc-800 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-zinc-100 transition hover:bg-zinc-700"
          @click="startWithChoice('no')"
        >
          No
        </button>
      </div>
    </div>
  </section>
</template>
