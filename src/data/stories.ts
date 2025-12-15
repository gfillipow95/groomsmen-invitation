import type { Stories } from '@/types/story'

export const stories: Stories = {
  josh: {
    name: 'Josh',
    start: 'memory1',
    nodes: {
      memory1: {
        text: 'Remember that Vegas trip where we almost missed the flight?',
        image: '/images/josh/vegas.jpg',
        next: 'memory2'
      },
      memory2: {
        text: 'Good times, man. We’ve been through a lot together.',
        options: [
          { text: 'Haha, classic us', next: 'proposal' },
          { text: 'Yeah, wild days', next: 'proposal' }
        ]
      },
      proposal: {
        text: 'So… will you be my groomsman?',
        image: '/images/josh/invite.jpg',
        end: true
      }
    }
  },
  kevin: {
    name: 'Kevin',
    start: 'memory1',
    nodes: {
      memory1: {
        text: 'Bro, remember grinding League until 3AM back in college?',
        image: '/images/kevin/league.jpg',
        next: 'proposal'
      },
      proposal: {
        text: 'Time for one last quest — be my groomsman?',
        end: true
      }
    }
  },
  tyler: {
    name: 'Tyler',
    start: 'memory1',
    nodes: {
      memory1: {
        text: 'Bro, remember grinding League until 3AM back in college?',
        image: '/images/kevin/league.jpg',
        next: 'proposal'
      },
      proposal: {
        text: 'Time for one last quest — be my groomsman?',
        end: true
      }
    }
  },
  colin: {
    name: 'Colin',
    start: 'memory1',
    nodes: {
      memory1: {
        text: 'Bro, remember grinding League until 3AM back in college?',
        image: '/images/kevin/league.jpg',
        next: 'proposal'
      },
      proposal: {
        text: 'Time for one last quest — be my groomsman?',
        end: true
      }
    }
  },
  austin: {
    name: 'Colin',
    start: 'memory1',
    nodes: {
      memory1: {
        text: 'Bro, remember grinding League until 3AM back in college?',
        image: '/images/kevin/league.jpg',
        next: 'proposal'
      },
      proposal: {
        text: 'Time for one last quest — be my groomsman?',
        end: true
      }
    }
  },
  tony: {
    name: 'Tony',
    start: 'memory1',
    nodes: {
      memory1: {
        text: 'Bro, remember grinding League until 3AM back in college?',
        image: '/images/kevin/league.jpg',
        next: 'proposal'
      },
      proposal: {
        text: 'Time for one last quest — be my groomsman?',
        end: true
      }
    }
  },
}
