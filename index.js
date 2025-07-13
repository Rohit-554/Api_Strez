// index.mjs
import Fastify from 'fastify'
import crypto from 'crypto'

const fastify = Fastify({ logger: true })

// Utility to generate a simple puzzle
function generatePuzzle() {
  const a = Math.floor(Math.random() * 10)
  const b = Math.floor(Math.random() * 10)
  return { question: `${a} + ${b}`, answer: a + b }
}

// Utility for encoding (Base64 + ROT13 + URL encode)
function encodeHardClue(message) {
  const base64 = Buffer.from(message).toString('base64')
  const rot13 = base64.replace(/[a-zA-Z]/g, c =>
    String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)
  )
  return encodeURIComponent(rot13)
}

fastify.get('/captcha', async (req, reply) => {
  const { question, answer } = generatePuzzle()
  req.session = { answer }
  return { question, hint: 'POST your answer to /validate with ?answer=' }
})

fastify.get('/validate', async (req, reply) => {
  const { answer } = req.query
  if (parseInt(answer) === req.session.answer) {
    return { next: '/step2' }
  }
  return reply.code(403).send({ error: 'Wrong answer' })
})

fastify.get('/step2', async () => {
  return { hint: 'Check response headers...', data: 'Hidden clue' }
})

fastify.addHook('onSend', async (req, reply, payload) => {
  if (req.url === '/step2') {
    reply.header('X-Clue', encodeHardClue('next is /step3'))
  }
})

fastify.get('/step3', async () => {
  return {
    clue: 'Solve Base64 + ROT13 + URL decode this: ' + encodeHardClue('findX at /x')
  }
})

fastify.get('/x', async () => {
  return { x: 'reveal-x-value' }
})

fastify.get('/step4', async () => {
  return {
    message: 'Now it gets tricky.',
    clue: 'Hidden steganography image link: /image-clue'
  }
})

fastify.get('/image-clue', async () => {
  const hidden = Buffer.from('Look deeper').toString('base64')
  return { imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB...' + hidden }
})

fastify.get('/step5', async () => {
  return {
    message: 'Brute force a 4-letter word whose md5 ends with "10f4a7"',
    note: 'Try /z?guess=....'
  }
})

fastify.get('/z', async (req, reply) => {
  const { guess } = req.query
  if (!guess || guess.length !== 4) {
    return reply.code(400).send({ error: '4-letter required' })
  }
  const hash = crypto.createHash('md5').update(guess).digest('hex')
  if (hash.endsWith('10f4a7')) return { z: guess }
  return { correct: false, hash }
})

// Steps 6 to 11: harder encoded clues
for (let i = 6; i <= 11; i++) {
  fastify.get(`/step${i}`, async () => {
    return {
      msg: `Step ${i}`,
      trap: 'This stage requires solving a multi-layer encoded text hidden in a JSON field.',
      encoded: encodeHardClue(`secret${i}`),
      extraChallenge: 'This clue requires reversing a custom substitution cipher.'
    }
  })
}

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
  console.log('Server running at http://localhost:3000')
})
