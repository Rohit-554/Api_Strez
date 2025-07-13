// Refactored and Enhanced Sentinel API Puzzle
import Fastify from 'fastify'
import crypto from 'crypto'

const fastify = Fastify({ logger: true })
const currentPuzzles = new Map()
const SECRET_KEY = 'sentinel-secret'

function generatePuzzle() {
  const operations = ['+', '-', '*']
  const op = operations[Math.floor(Math.random() * operations.length)]
  let a, b, answer
  switch (op) {
    case '+':
      a = Math.floor(Math.random() * 50) + 1
      b = Math.floor(Math.random() * 50) + 1
      answer = a + b
      break
    case '-':
      a = Math.floor(Math.random() * 50) + 25
      b = Math.floor(Math.random() * 25) + 1
      answer = a - b
      break
    case '*':
      a = Math.floor(Math.random() * 12) + 1
      b = Math.floor(Math.random() * 12) + 1
      answer = a * b
      break
  }
  return { question: `${a} ${op} ${b}`, answer }
}

function encodeBase64(text) {
  return Buffer.from(text).toString('base64')
}

function decodeBase64(text) {
  return Buffer.from(text, 'base64').toString('utf8')
}

function encodeROT13(text) {
  return text.replace(/[a-zA-Z]/g, c =>
    String.fromCharCode(
      (c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26
    )
  )
}

function encodeMorse(text) {
  const morseMap = {
    'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.',
    'f': '..-.', 'g': '--.', 'h': '....', 'i': '..', 'j': '.---',
    'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---',
    'p': '.--.', 'q': '--.-', 'r': '.-.', 's': '...', 't': '-',
    'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-', 'y': '-.--',
    'z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.', '-': '-....-', '/': '-..-.'
  }
  return text.toLowerCase()
    .split('')
    .map(c => morseMap[c] || '')
    .filter(code => code !== '')
    .join(' ')
}

function encodeHex(text) {
  return Buffer.from(text).toString('hex')
}

function signPayload(id, answer) {
  return crypto.createHmac('sha256', SECRET_KEY)
    .update(id + answer)
    .digest('hex')
}

fastify.addHook('onRequest', async (req, reply) => {
  reply.header('Access-Control-Allow-Origin', '*')
  reply.header('X-Security-Level', 'CLASSIFIED')
})

fastify.get('/', async (req, reply) => {
  return {
    status: 'INTRUSION DETECTED',
    nextProtocol: encodeBase64('/boot-sequence'),
    hint: 'The veil of sixty-four guards the initialization sequence.',
    riddle: 'System protocol: All endpoints and data inputs are case-sensitive lowercase only. CAPS = ACCESS DENIED.',
  }
})

fastify.get('/boot-sequence', async (req, reply) => {
  const { question, answer } = generatePuzzle()
  const id = crypto.randomBytes(8).toString('hex')
  currentPuzzles.set(id, answer)
  const signature = signPayload(id, answer)

  reply.header('X-Puzzle-ID', id)
  reply.header('X-Phase-Key', encodeROT13('/verify-core'))
  reply.header('X-Auth-Method', 'HMAC-SHA256(id + answer)')

  return {
    system: 'SENTINEL-AI v4',
    status: 'AUTH_REQUIRED',
    prompt: `Security Query: Calculate ${question}`,
    instruction: 'Submit your credentials using active transmission protocol.',
    requiredFields: ['id', 'answer', 'token'],
    tokenNote: 'Generate token as HMAC_SHA256(id + answer) using secret `sentinel-secret`',
    hint: 'A passive request will not suffice — only active data submission is honored.',
    transmissionHint: 'Send your verification package to the rotated endpoint in the phase key.',
    examplePayload: {
      id: 'abc123...',
      answer: '42',
      token: 'HMAC_HEX_HASH_HERE'
    },
    step: '1/10'
  }
})

fastify.post('/check', async (req, reply) => {
  const { id, answer, token } = req.body

  if (!id || !answer || !token) {
    return reply.code(400).send({ error: 'MISSING_FIELDS' })
  }

  const expected = signPayload(id, answer.toString())
  const correctAnswer = currentPuzzles.get(id)

  if (!correctAnswer || parseInt(answer) !== correctAnswer) {
    return reply.code(403).send({ error: 'ACCESS_DENIED' })
  }

  if (token !== expected) {
    return reply.code(403).send({ error: 'INVALID_SIGNATURE' })
  }

  currentPuzzles.delete(id)
  reply.header('X-Access-Signal', encodeBase64('/command-node'))

  return {
    message: 'Validated. Proceed by decoding X-Access-Signal.',
    step: '2/10'
  }
})

fastify.get('/command-node', async (req, reply) => {
  reply.header('X-Spectral-Link', encodeMorse('/mainframe-gate'))

  return {
    status: 'COMMAND_NODE_ONLINE',
    message: 'Encrypted tones hum a rhythmic language.',
    transmission: 'Dots and dashes speak louder than words.',
    hint: 'The cipher king awaits your whisper. Speak his name through active transmission.',
    authenticationNote: 'Only data submission will unlock the next phase.',
    requiredData: 'Send the name of the ancient rotation cipher master.',
    exampleStructure: { keyword: 'cipher_name_here' },
    transmissionHint: 'POST your knowledge to the decoded spectral link.',
    step: '3/10'
  }
})

fastify.post('/mainframe-gate', async (req, reply) => {
  const { keyword } = req.body
  if (keyword && keyword.toLowerCase() === 'caesar') {
    reply.header('X-Next-Phase', encodeROT13('/root-terminal'))
    return {
      message: 'Ruler of rotation accepted. Proceed by decoding the next phase.',
      step: '4/10'
    }
  } else {
    return reply.code(403).send({ error: 'INCORRECT_KEYWORD' })
  }
})

fastify.get('/root-terminal', async (req, reply) => {
  reply.header('X-Final-Trace', encodeMorse('/access-final'))
  return {
    status: 'ROOT_TERMINAL_ACTIVE',
    message: 'Administrator console pulsing. Final sequence transmission encoded.',
    transmission: 'The last signal awaits acknowledgment.',
    hint: 'To unlock the payload, acknowledgment must be actively transmitted.',
    authenticationNote: 'Send confirmation of your intent to proceed.',
    requiredConfirmation: 'Submit the word that means "to move data from one place to another".',
    transmissionStructure: { confirm: 'action_word_here' },
    transmissionHint: 'POST your confirmation to the decoded final trace.',
    step: '5/10'
  }
})

fastify.post('/access-final', async (req, reply) => {
  const { confirm } = req.body
  if (confirm === 'transfer') {
    reply.header('X-Encrypted-Payload', encodeBase64('/uplink-gateway'))
    return {
      message: 'Data payload confirmed. Proceed by decoding the encrypted payload.',
      step: '6/10'
    }
  } else {
    return reply.code(403).send({ error: 'INVALID_CONFIRMATION' })
  }
})

fastify.get('/uplink-gateway', async (req, reply) => {
  reply.header('X-Hex-Path', encodeHex('/datastream-node'))
  return {
    status: 'UPLINK_GATEWAY_ONLINE',
    message: 'Gateway established. Datastream node requires unlock signal.',
    hint: 'Active transmission required to proceed.',
    unlockNote: 'Send the word that represents "communication" or "transmission".',
    transmissionStructure: { unlock: 'signal_word_here' },
    transmissionHint: 'POST your unlock code to the hex-decoded path.',
    step: '7/10'
  }
})

fastify.post('/datastream-node', async (req, reply) => {
  const { unlock } = req.body
  if (unlock === 'signal') {
    reply.header('X-Coordinates', encodeMorse('/vault-access'))
    return {
      message: 'Coordinates unlocked. Proceed by decoding the morse coordinates.',
      step: '8/10'
    }
  } else {
    return reply.code(403).send({ error: 'INVALID_SIGNAL' })
  }
})

fastify.get('/vault-access', async (req, reply) => {
  return {
    status: 'VAULT_ACCESS_INITIALIZED',
    message: 'Vault access protocol engaged. Final destination awaits.',
    nextProtocol: encodeBase64('/white-hat-access'),
    hint: 'Decode the final protocol to reach your destination.',
    step: '9/10'
  }
})

fastify.get('/white-hat-access', async (req, reply) => {
  return {
    access: 'GRANTED',
    hackerID: `WHH-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    achievement: 'MISSION COMPLETE',
    badge: 'Elite Digital Defender',
    motto: 'Hack the planet, but protect the people.',
    step: '10/10'
  }
})

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'

fastify.listen({ port: PORT, host: HOST }).then(() => {
  console.log(`Enhanced Sentinel API running on http://${HOST}:${PORT}`)
}).catch(err => {
  fastify.log.error(err)
  process.exit(1)
})