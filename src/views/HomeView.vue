<script setup lang="ts">
const question = 'Who was there that night?'

const answers = [
  'Josh',
  'Kevin',
  'Tyler',
  'Austin'
]

function selectAnswer(answer: string) {
  console.log('Selected:', answer)
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-neutral-100 px-4"
  >
    <!-- Image -->
    <div class="mb-6 -mt-10">
      <img
        src="../assets/test-img.png"
        alt="Pixel scene"
        class="w-36 h-36 object-contain image-rendering-pixelated"
      />
    </div>

    <!-- Question -->
    <h1
      class="mb-6 text-center text-xl sm:text-2xl font-bold tracking-wide uppercase"
    >
      {{ question }}
    </h1>

    <!-- Answers -->
    <div class="w-full max-w-sm flex flex-col items-stretch gap-4">
      <button
        v-for="answer in answers"
        :key="answer"
        @click="selectAnswer(answer)"
        class="
          relative
          py-3
          text-base
          font-bold
          uppercase
          text-neutral-100
          bg-neutral-800

          border-t-4 border-l-4
          border-b-4 border-r-4
          border-t-neutral-200
          border-l-neutral-200
          border-b-neutral-700
          border-r-neutral-700

          active:translate-y-1
          active:border-t-neutral-700
          active:border-l-neutral-700
          active:border-b-neutral-200
          active:border-r-neutral-200

          focus:outline-none
          select-none
          transition-none
        "
      >
        {{ answer }}
      </button>
    </div>

  </div>
</template>
