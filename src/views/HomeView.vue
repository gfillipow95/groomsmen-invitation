<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
    <div class="w-full max-w-xl rounded-xl border border-zinc-700 bg-zinc-900/70 p-8 text-center">
      <p class="mb-2 text-xs uppercase tracking-[0.3em] text-zinc-400">Groomsmen Invitation</p>
      <h1 class="mb-3 text-3xl font-semibold">Choose Your Story Link</h1>
      <p class="mb-6 text-sm text-zinc-300">Open your direct link to begin the game.</p>
      <RouterLink
        to="/story/friend"
        class="inline-flex rounded-md border border-zinc-500 bg-zinc-800 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-zinc-100 transition hover:bg-zinc-700"
      >
        Start Demo Link
      </RouterLink>
    </div>
  </section>
</template>
