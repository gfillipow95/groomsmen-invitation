<script setup lang="ts">
// App.vue should only contain app-wide layout logic
</script>

<template>
  <div id="app">
    <!-- Page Content -->
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Global (non-scoped) styles */

* {
  box-sizing: border-box;
}

html,
body,
#app {
  margin: 0;
  padding: 0;
  min-height: 100%;
}

.app-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
}

.nav {
  display: flex;
  gap: 1rem;
}

.nav-link {
  text-decoration: none;
  font-weight: 500;
  color: #374151;
}

.nav-link.router-link-active {
  color: #2563eb;
}

.app-main {
  padding: 2rem;
}
</style>
