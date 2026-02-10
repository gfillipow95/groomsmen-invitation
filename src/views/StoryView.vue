<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import memories from '@/assets/shared/story.json'

type Stage = 'gate' | 'setup' | 'memory' | 'lastQuestionGate' | 'proposal' | 'ending'

type MemoryItem = {
  title: string
  choice1: string
  choice2: string
  choice3: string
  choice4: string
  answer?: 'choice1' | 'choice2' | 'choice3' | 'choice4'
  image?: string
}

const route = useRoute()
const friendSlug = computed(() => String(route.params.friend ?? 'friend'))
const friendName = computed(
  () => friendSlug.value.charAt(0).toUpperCase() + friendSlug.value.slice(1)
)

const STORAGE_VERSION = 'v2'
const gateChoice = ref<'yes' | 'no' | null>(null)
const playerNameInput = ref('')
const playerName = ref('')
const stage = ref<Stage>('gate')
const memoryIndex = ref(0)
const selectedAnswer = ref<'choice1' | 'choice2' | 'choice3' | 'choice4' | null>(null)
const feedback = ref('')
const totalAttempts = ref(0)
const wrongAttempts = ref(0)
const noCount = ref(0)
const lastQuestionFeedback = ref('')

const setupLines = computed(() => [
  `Sunday night. You, ${friendName.value}, and the crew are locked in at Gen's house for football.`,
  'The game is close. Trash talk is at all-time highs. Someone yells for more wings.',
  'The lights snap off. Every screen goes black. The room goes dead silent.',
  'A neon rift tears across the wall, and memories start pulling everyone through time.',
  'Only one way back: survive every memory and prove you still know the squad.'
])

const storyMemories = computed<MemoryItem[]>(() => memories as MemoryItem[])

function getStorageKey(suffix: string) {
  return `groomsmen:${STORAGE_VERSION}:${friendSlug.value}:${suffix}`
}

function persistState() {
  localStorage.setItem(getStorageKey('gateChoice'), gateChoice.value ?? '')
  localStorage.setItem(getStorageKey('playerName'), playerName.value)
  localStorage.setItem(getStorageKey('stage'), stage.value)
  localStorage.setItem(getStorageKey('memoryIndex'), String(memoryIndex.value))
  localStorage.setItem(getStorageKey('totalAttempts'), String(totalAttempts.value))
  localStorage.setItem(getStorageKey('wrongAttempts'), String(wrongAttempts.value))
  localStorage.setItem(getStorageKey('noCount'), String(noCount.value))
}

function restoreState() {
  gateChoice.value = null
  playerNameInput.value = ''
  playerName.value = ''
  stage.value = 'gate'
  memoryIndex.value = 0
  selectedAnswer.value = null
  feedback.value = ''
  totalAttempts.value = 0
  wrongAttempts.value = 0
  noCount.value = 0

  const savedGate = localStorage.getItem(getStorageKey('gateChoice'))
  if (savedGate === 'yes' || savedGate === 'no') {
    gateChoice.value = savedGate
  }

  playerName.value = localStorage.getItem(getStorageKey('playerName')) ?? ''
  playerNameInput.value = playerName.value

  const savedStage = localStorage.getItem(getStorageKey('stage')) as Stage | null
  if (savedStage && ['gate', 'setup', 'memory', 'lastQuestionGate', 'proposal', 'ending'].includes(savedStage)) {
    stage.value = savedStage
  }

  const savedMemoryIndex = Number(localStorage.getItem(getStorageKey('memoryIndex')) ?? '0')
  if (!Number.isNaN(savedMemoryIndex)) {
    memoryIndex.value = Math.min(
      Math.max(savedMemoryIndex, 0),
      Math.max(storyMemories.value.length - 1, 0)
    )
  }

  const savedTotalAttempts = Number(localStorage.getItem(getStorageKey('totalAttempts')) ?? '0')
  totalAttempts.value = Number.isNaN(savedTotalAttempts) ? 0 : savedTotalAttempts

  const savedWrongAttempts = Number(localStorage.getItem(getStorageKey('wrongAttempts')) ?? '0')
  wrongAttempts.value = Number.isNaN(savedWrongAttempts) ? 0 : savedWrongAttempts

  const savedNoCount = Number(localStorage.getItem(getStorageKey('noCount')) ?? '0')
  noCount.value = Number.isNaN(savedNoCount) ? 0 : savedNoCount

  if (stage.value !== 'gate' && !playerName.value) {
    stage.value = 'gate'
  }
}

const currentMemory = computed(() => storyMemories.value[memoryIndex.value])

function memoryChoices(memory: MemoryItem) {
  return [
    { key: 'choice1', text: memory.choice1 },
    { key: 'choice2', text: memory.choice2 },
    { key: 'choice3', text: memory.choice3 },
    { key: 'choice4', text: memory.choice4 }
  ] as const
}

function inferAnswer(memory: MemoryItem): 'choice1' | 'choice2' | 'choice3' | 'choice4' {
  if (memory.answer) {
    return memory.answer
  }

  // Fallback for malformed story rows without an answer key.
  const loweredTitle = memory.title.toLowerCase()
  if (loweredTitle.includes('rage quit') || loweredTitle.includes('lady bug')) {
    return 'choice3'
  }

  return 'choice1'
}

function resolveImageSrc(imagePath?: string) {
  if (!imagePath) {
    return ''
  }

  const filename = imagePath.split('/').pop()
  if (!filename) {
    return ''
  }

  return new URL(`../assets/${filename}`, import.meta.url).href
}

function chooseGate(choice: 'yes' | 'no') {
  gateChoice.value = choice
  feedback.value = ''
  persistState()
}

function submitName() {
  const trimmed = playerNameInput.value.trim()
  if (!trimmed) {
    feedback.value = 'Type your name first. You are not escaping this dimension anonymously.'
    return
  }

  playerName.value = trimmed
  feedback.value = ''
  stage.value = 'setup'
  persistState()
}

function startMemories() {
  stage.value = 'memory'
  feedback.value = ''
  selectedAnswer.value = null
  persistState()
}

function submitMemoryAnswer() {
  if (!selectedAnswer.value || !currentMemory.value) {
    feedback.value = 'Pick an answer before time collapses.'
    return
  }

  totalAttempts.value += 1

  const correct = inferAnswer(currentMemory.value)
  if (selectedAnswer.value === correct) {
    feedback.value = 'Correct. Memory stabilized.'

    const isLastMemory = memoryIndex.value >= storyMemories.value.length - 1
    if (isLastMemory) {
      stage.value = 'lastQuestionGate'
      selectedAnswer.value = null
      feedback.value = ''
    } else {
      memoryIndex.value += 1
      selectedAnswer.value = null
    }
  } else {
    wrongAttempts.value += 1
    feedback.value = 'Wrong memory. The rift rejects that answer. Try again.'
  }

  persistState()
}

function selectNoAtProposal() {
  noCount.value += 1
  persistState()
}

function acceptProposal() {
  stage.value = 'ending'
  feedback.value = ''
  persistState()
}

function restartExperience() {
  gateChoice.value = null
  playerName.value = ''
  playerNameInput.value = ''
  stage.value = 'gate'
  memoryIndex.value = 0
  selectedAnswer.value = null
  feedback.value = ''
  totalAttempts.value = 0
  wrongAttempts.value = 0
  noCount.value = 0
  lastQuestionFeedback.value = ''
  persistState()
}

function goToProposalFromLastQuestion() {
  lastQuestionFeedback.value = ''
  stage.value = 'proposal'
  persistState()
}

function forceToProposalFromLastQuestion() {
  lastQuestionFeedback.value = 'Too bad.'
  window.setTimeout(() => {
    stage.value = 'proposal'
    persistState()
  }, 650)
}

function buildNoResponseLines() {
  const gentle = [
    'Please select yes.',
    "I am asking nicely.",
    'Come on, yes is the correct timeline.',
    'No is not part of this story arc.',
    'Try yes. It looks great on you.',
    'I even set up floating letters for this.',
    'This is your gentle reminder to press yes.',
    'Still no? Bold move.',
    'Football is waiting on your yes.',
    'Final polite warning: press yes.'
  ]

  const annoyed = [
    'You are testing the script now.',
    'The yes button is right there.',
    'Stop dodging destiny.',
    'Nope. Choose yes.',
    'The timeline keeps glitching when you say no.',
    'Gen did not code a no ending.',
    'The room got colder after that no.',
    'Selecting no has strong villain energy.',
    'This is becoming personal.',
    'Hit yes and nobody gets jump-scared.'
  ]

  const sad = [
    'That no hurt a little.',
    'I practiced this proposal, you know.',
    'The floating letters are losing hope.',
    'Even the football paused for this moment.',
    'I thought we were memory-bros.',
    'The rift is now disappointed.',
    'Please do not make me beg in TypeScript.',
    'I wrote this with love and mild panic.',
    'Are we not doing this together?',
    'That was an emotionally expensive no.'
  ]

  const angry = [
    'Enough. Press yes.',
    'You cannot brute-force a no outcome.',
    'The yes button is mandatory.',
    'Stop selecting no.',
    'By order of Gen: yes only.',
    'This is your final final warning.',
    'No is cancelled.',
    'The dimension refuses your rebellion.',
    'Choose yes and step away from chaos.',
    'YES. NOW.'
  ]

  const loop = [...gentle, ...annoyed, ...sad, ...angry]
  const lines: string[] = []
  for (let i = 0; i < 100; i += 1) {
    const phase = Math.floor(i / 25)
    const base = loop[i % loop.length]
    const tone =
      phase === 0
        ? 'calm'
        : phase === 1
          ? 'stern'
          : phase === 2
            ? 'sad'
            : 'furious'
    lines.push(`[${i + 1}/100 - ${tone}] ${base}`)
  }

  return lines
}

const noResponseLines = buildNoResponseLines()
const currentNoMessage = computed(() => {
  if (noCount.value <= 0) {
    return 'Choose wisely.'
  }

  return noResponseLines[Math.min(noCount.value - 1, noResponseLines.length - 1)]
})

const gateResponse = computed(() => {
  if (gateChoice.value === 'yes') {
    return 'Great! You chose courage. Enter your name and we begin.'
  }

  if (gateChoice.value === 'no') {
    return 'Well too bad. Gen wants you to play. Enter your name.'
  }

  return ''
})

onMounted(() => {
  restoreState()
})

watch(friendSlug, () => {
  restoreState()
})
</script>

<template>
  <section class="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-900 text-zinc-100">
    <div class="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-10 sm:px-6">
      <header class="mb-6 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.2em] text-zinc-400">
        <p>Gen's Dimension Rift</p>
        <p>Player Link: {{ friendSlug }}</p>
      </header>

      <div class="rounded-xl border border-zinc-700/60 bg-zinc-950/70 p-6 shadow-[0_0_45px_rgba(255,255,255,0.06)] backdrop-blur-sm sm:p-8">
        <template v-if="stage === 'gate'">
          <p class="mb-2 text-xs uppercase tracking-[0.3em] text-red-400">Welcome</p>
          <h1 class="mb-4 text-3xl font-semibold text-zinc-50 sm:text-4xl">You want to play a game?</h1>
          <p class="mb-6 text-sm text-zinc-400">The game is already loaded, {{ friendName }}.</p>

          <div v-if="!gateChoice" class="mb-6 flex flex-wrap gap-3">
            <button
              type="button"
              class="rounded-md border border-red-500/80 bg-red-700/20 px-6 py-2 text-sm font-semibold uppercase tracking-widest text-red-100 transition hover:bg-red-700/35"
              @click="chooseGate('yes')"
            >
              Yes
            </button>
            <button
              type="button"
              class="rounded-md border border-zinc-500 bg-zinc-800 px-6 py-2 text-sm font-semibold uppercase tracking-widest text-zinc-100 transition hover:bg-zinc-700"
              @click="chooseGate('no')"
            >
              No
            </button>
          </div>

          <div v-if="gateChoice" class="rounded-lg border border-zinc-700 bg-zinc-900/80 p-4">
            <p
              class="mb-4 text-sm"
              :class="gateChoice === 'yes' ? 'text-emerald-300' : 'text-orange-200'"
            >
              {{ gateResponse }}
            </p>

            <label class="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-400" for="player-name">
              Your Name
            </label>
            <input
              id="player-name"
              v-model="playerNameInput"
              type="text"
              placeholder="Type your name"
              class="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-red-400/60 transition focus:ring"
              @keydown.enter="submitName"
            />

            <button
              type="button"
              class="mt-4 rounded-md border border-emerald-500/70 bg-emerald-700/20 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-emerald-200 transition hover:bg-emerald-700/35"
              @click="submitName"
            >
              Start Game
            </button>
          </div>
        </template>

        <template v-else-if="stage === 'setup'">
          <p class="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300">Setup Sequence</p>
          <h2 class="mb-6 text-2xl font-semibold text-zinc-50 sm:text-3xl">The Lights Go Out</h2>

          <div class="space-y-3 text-sm leading-relaxed text-zinc-200">
            <p v-for="line in setupLines" :key="line">{{ line }}</p>
          </div>

          <button
            type="button"
            class="mt-8 rounded-md border border-cyan-400/60 bg-cyan-500/10 px-6 py-2 text-sm font-semibold uppercase tracking-wider text-cyan-100 transition hover:bg-cyan-500/20"
            @click="startMemories"
          >
            Enter First Memory
          </button>
        </template>

        <template v-else-if="stage === 'memory' && currentMemory">
          <p class="mb-2 text-xs uppercase tracking-[0.3em] text-violet-300">
            Memory {{ memoryIndex + 1 }} / {{ storyMemories.length }}
          </p>
          <h2 class="mb-4 text-xl font-semibold leading-snug text-zinc-50 sm:text-2xl">{{ currentMemory.title }}</h2>

          <img
            v-if="currentMemory.image"
            :src="resolveImageSrc(currentMemory.image)"
            alt="Memory scene"
            class="mb-6 h-52 w-full rounded-lg border border-zinc-700 object-cover sm:h-64"
          />

          <div class="grid gap-3 sm:grid-cols-2">
            <button
              v-for="choice in memoryChoices(currentMemory)"
              :key="choice.key"
              type="button"
              class="rounded-md border px-4 py-3 text-left text-sm font-medium transition"
              :class="selectedAnswer === choice.key
                ? 'border-violet-300 bg-violet-500/20 text-violet-100'
                : 'border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800'"
              @click="selectedAnswer = choice.key"
            >
              {{ choice.text }}
            </button>
          </div>

          <div class="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="rounded-md border border-violet-400/70 bg-violet-600/15 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-violet-100 transition hover:bg-violet-600/30"
              @click="submitMemoryAnswer"
            >
              Lock Answer
            </button>
            <p class="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Wrong attempts: {{ wrongAttempts }}
            </p>
            <p class="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Total tries: {{ totalAttempts }}
            </p>
          </div>
        </template>

        <template v-else-if="stage === 'lastQuestionGate'">
          <p class="mb-2 text-xs uppercase tracking-[0.3em] text-fuchsia-300">Final Checkpoint</p>
          <h2 class="mb-4 text-2xl font-semibold text-zinc-50 sm:text-3xl">Are you ready for the last question?</h2>
          <p class="mb-6 text-sm text-zinc-300">
            One final step before the timeline fully restores.
          </p>

          <div class="flex flex-wrap gap-3">
            <button
              type="button"
              class="rounded-md border border-emerald-400/70 bg-emerald-600/20 px-6 py-2 text-sm font-semibold uppercase tracking-widest text-emerald-100 transition hover:bg-emerald-600/40"
              @click="goToProposalFromLastQuestion"
            >
              Yes
            </button>
            <button
              type="button"
              class="rounded-md border border-rose-400/60 bg-rose-600/20 px-6 py-2 text-sm font-semibold uppercase tracking-widest text-rose-100 transition hover:bg-rose-600/40"
              @click="forceToProposalFromLastQuestion"
            >
              No
            </button>
          </div>

          <p v-if="lastQuestionFeedback" class="mt-5 text-sm text-rose-200">
            {{ lastQuestionFeedback }}
          </p>
        </template>

        <template v-else-if="stage === 'proposal'">
          <p class="mb-2 text-xs uppercase tracking-[0.3em] text-amber-300">Final Room</p>
          <div class="mb-6 rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-6 text-center">
            <p class="floating-text text-3xl font-bold text-amber-100 sm:text-4xl">
              Will You Be My Groomsman?
            </p>
          </div>

          <p class="mb-5 text-sm text-zinc-300">
            {{ currentNoMessage }}
          </p>

          <div class="flex flex-wrap gap-3">
            <button
              type="button"
              class="rounded-md border border-emerald-400/70 bg-emerald-600/20 px-6 py-2 text-sm font-semibold uppercase tracking-widest text-emerald-100 transition hover:bg-emerald-600/40"
              @click="acceptProposal"
            >
              Yes
            </button>
            <button
              type="button"
              class="rounded-md border border-rose-400/60 bg-rose-600/20 px-6 py-2 text-sm font-semibold uppercase tracking-widest text-rose-100 transition hover:bg-rose-600/40"
              @click="selectNoAtProposal"
            >
              No
            </button>
          </div>

          <p class="mt-5 text-xs uppercase tracking-[0.2em] text-zinc-500">
            No button pressed: {{ noCount }} times
          </p>
        </template>

        <template v-else-if="stage === 'ending'">
          <p class="mb-2 text-xs uppercase tracking-[0.3em] text-emerald-300">Timeline Restored</p>
          <h2 class="mb-4 text-2xl font-semibold text-zinc-50 sm:text-3xl">Let's Go, {{ playerName }}.</h2>
          <p class="mb-2 text-sm text-zinc-200">
            You made it back to Gen's house, just in time to finish Sunday Night Football.
          </p>
          <p class="mb-5 text-sm text-zinc-300">
            Final stats: {{ wrongAttempts }} wrong answers across {{ totalAttempts }} total attempts.
          </p>

          <button
            type="button"
            class="rounded-md border border-zinc-500 bg-zinc-800 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-zinc-100 transition hover:bg-zinc-700"
            @click="restartExperience"
          >
            Replay Story
          </button>
        </template>

        <p v-if="feedback" class="mt-5 text-sm text-amber-200">{{ feedback }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.floating-text {
  animation: floatPulse 3s ease-in-out infinite;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
}

@keyframes floatPulse {
  0%,
  100% {
    transform: translateY(0px) rotate(-1deg);
  }

  50% {
    transform: translateY(-8px) rotate(1deg);
  }
}
</style>
