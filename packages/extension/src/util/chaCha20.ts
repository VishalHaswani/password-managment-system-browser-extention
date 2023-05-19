// import { randomFillSync } from 'crypto'
import { Buffer } from 'buffer'

// export class ChaCha20Random {
//   private readonly generator: ChaCha20
//   private buffer: DataView
//   private position: number

//   constructor () {
//     // Generate a random key and nonce using the crypto library
//     const key = new Uint32Array(8)
//     randomFillSync(key)

//     const nonce = new Uint32Array(3)
//     randomFillSync(nonce)

//     this.generator = new ChaCha20(key, nonce)
//     this.buffer = new DataView(this.generator.block(0).buffer)
//     this.position = 0
//   }

//   randomInt32 (): number {
//     if (this.position >= 64) {
//       const block = this.generator.block(0)
//       this.buffer = new DataView(block.buffer, block.byteOffset, block.byteLength)
//       this.position = 0
//     }

//     const randomInt = this.buffer.getUint32(this.position, true)
//     this.position += 4

//     return randomInt
//   }

//   randomInRange (min: number, max: number): number {
//     const range: number = max - min
//     const randomInt: number = this.randomInt32()
//     return min + Math.floor(randomInt / 0x100000000 * range)
//   }
// }

// Function to convert string to Uint32Array
function stringToUint32Array (str: string): Uint32Array {
  const codePoints = Array.from(str, c => c.codePointAt(0)!)
  const len = codePoints.length
  const uint32Array = new Uint32Array(8)
  for (let i = 0; i < len; i++) {
    uint32Array[i >>> 2] |= codePoints[i] << (8 * (i % 4))
  }
  return uint32Array
}

export class ChaCha20 {
  private readonly key: Uint32Array
  private readonly nonce: Uint32Array
  private counter: number

  constructor (key: string, nonce: Uint32Array) {
    this.key = stringToUint32Array(key)
    this.nonce = nonce
    this.counter = 0
  }

  // The quarter round function
  quarterRound (a: number, b: number, c: number, d: number): number[] {
    a += b; d ^= a; d = (d << 16) | (d >>> 16)
    c += d; b ^= c; b = (b << 12) | (b >>> 20)
    a += b; d ^= a; d = (d << 8) | (d >>> 24)
    c += d; b ^= c; b = (b << 7) | (b >>> 25)
    return [a, b, c, d]
  }

  // The ChaCha20 block function
  block (counter: number): Uint8Array {
    const state = new Uint32Array(16)
    state[0] = 0x61707865
    state[1] = 0x3320646e
    state[2] = 0x79622d32
    state[3] = 0x6b206574
    state[4] = this.key[0]
    state[5] = this.key[1]
    state[6] = this.key[2]
    state[7] = this.key[3]
    state[8] = this.key[4]
    state[9] = this.key[5]
    state[10] = this.key[6]
    state[11] = this.key[7]
    state[12] = counter & 0xffffffff
    state[13] = counter >> 32
    state[14] = this.nonce[0]
    state[15] = this.nonce[1]

    const workingState = new Uint32Array(state)
    for (let i = 0; i < 20; i++) {
      [workingState[0], workingState[4], workingState[8], workingState[12]] =
                this.quarterRound(workingState[0], workingState[4], workingState[8], workingState[12]);
      [workingState[1], workingState[5], workingState[9], workingState[13]] =
                this.quarterRound(workingState[1], workingState[5], workingState[9], workingState[13]);
      [workingState[2], workingState[6], workingState[10], workingState[14]] =
                this.quarterRound(workingState[2], workingState[6], workingState[10], workingState[14]);
      [workingState[3], workingState[7], workingState[11], workingState[15]] =
                this.quarterRound(workingState[3], workingState[7], workingState[11], workingState[15]);

      [workingState[0], workingState[5], workingState[10], workingState[15]] =
                this.quarterRound(workingState[0], workingState[5], workingState[10], workingState[15]);
      [workingState[1], workingState[6], workingState[11], workingState[12]] =
                this.quarterRound(workingState[1], workingState[6], workingState[11], workingState[12]);
      [workingState[2], workingState[7], workingState[8], workingState[13]] =
                this.quarterRound(workingState[2], workingState[7], workingState[8], workingState[13]);
      [workingState[3], workingState[4], workingState[9], workingState[14]] =
                this.quarterRound(workingState[3], workingState[4], workingState[9], workingState[14])
    }
    const output: Uint8Array = new Uint8Array(64)
    for (let i = 0; i < 16; i++) {
      const value: number = state[i] + workingState[i]
      output[i * 4 + 0] = value & 0xff
      output[i * 4 + 1] = (value >> 8) & 0xff
      output[i * 4 + 2] = (value >> 16) & 0xff
      output[i * 4 + 3] = (value >> 24) & 0xff
    }
    return output
  }

  // The ChaCha20 encryption function
  encrypt (message: Buffer | string): Buffer {
    this.counter = 0
    const messageBuffer: Buffer = Buffer.from(message)
    const encryptedMessage: Buffer = Buffer.alloc(messageBuffer.length)
    for (let i = 0; i < messageBuffer.length; i += 64) {
      const block: Uint8Array = this.block(this.counter++)
      for (let j: number = i; j < i + 64 && j < messageBuffer.length; j++) {
        encryptedMessage[j] = messageBuffer[j] ^ block[j - i]
      }
    }
    return encryptedMessage
  }

  // The ChaCha20 decryption function
  decrypt (encryptedMessage: Buffer): Buffer {
    this.counter = 0
    return this.encrypt(encryptedMessage)
  }
}

// const keyText = 'Test String eithowhdfojwebfljl qepweifpij qeprijp'

// const nonce: Uint32Array = new Uint32Array([0x00000009, 0x0000004a, 0x00000000])

// const chacha20: ChaCha20 = new ChaCha20(keyText, nonce)

// const message = 'Test passwdfkweojfoweford'

// const encryptedMessage: string = chacha20.encrypt(message).toString('hex')
// console.log('Encrypted Message:', encryptedMessage)

// const decryptedMessage: Buffer = chacha20.decrypt(Buffer.from(encryptedMessage, 'hex'))
// console.log('Decrypted Message:', decryptedMessage.toString('utf8'))

// const encryptedMessage2: string = chacha20.encrypt(message).toString('hex')
// console.log('Encrypted Message:', encryptedMessage2)

// const decryptedMessage2: Buffer = chacha20.decrypt(Buffer.from(encryptedMessage, 'hex'))
// console.log('Decrypted Message:', decryptedMessage2.toString('utf8'))

// const min = 1
// const max = 10000
// const random: ChaCha20Random = new ChaCha20Random()

// console.log(random.randomInRange(min, max) % 26)
