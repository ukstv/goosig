/* eslint camelcase: "off" */

'use strict';

const assert = require('../test/util/assert');
const {performance} = require('perf_hooks');
const testUtil = require('../test/util');
const Goo = require('../lib/native/goo');

const prover = new Goo(Goo.RSA2048, 2, 3, 2048);
const verifier = new Goo(Goo.RSA2048, 2, 3, null);

const msg = Buffer.from('2048-bit RSA GoUO, 2048-bit Signer PK');
const [p, q] = testUtil.sample(testUtil.primes1024, 2);
const key = testUtil.rsaKey(p, q);

// Generate the challenge token.
const s_prime = prover.generate();
const C1 = prover.challenge(s_prime, key);

// Generate the proof.
const sig = prover.sign(msg, s_prime, key);

// Verify the proof.
const result = verifier.verify(msg, sig, C1);

assert.strictEqual(result, true);

const start = performance.now();

let i;

for (i = 0; i < 100000; i++) {
  const result = verifier.verify(msg, sig, C1);
  assert.strictEqual(result, true);
}

console.log('Native: %d', (performance.now() - start) / i);
