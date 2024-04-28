<script setup>
import Sidebar from './farmtrack/components/sidebar.component.vue'
</script>

<template>
  <div class="app">
    <pv-toast></pv-toast>
    <!-- Sidebar -->
    <Sidebar />
    <!-- Content -->
    <RouterView />
  </div>
</template>

<style lang="scss">
:root {
  --primary: #f5f5f5;
  --primary-alt: #22c55e;
  --grey: #64748b;
  --dark: #242424;
  --dark-alt: #282828;
  --light: #181818;
  --sidebar-width: 300px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Fira sans', sans-serif;
}

body {
  background: var(--light);
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.app {
  display: flex;

  main {
    flex: 1 1 0;
    padding: 2rem;

    @media (max-width: 1024px) {
      padding-left: 6rem;
    }
  }
}
</style>
