'use strict';

const md5 = require('md5');
const crypto = require('crypto');
const uuid = require('uuid');
const PasswordHash = require('phpass').PasswordHash;

let passwordHash;
const Hash = {
  get passwordHash() {
    if (!passwordHash) passwordHash = new PasswordHash();
    return passwordHash;
  },

  generateHash(string) {
    return Hash.passwordHash.hashPassword(string);
  },

  validateHash(string, hash) {
    return Hash.passwordHash.checkPassword(string, hash);
  },

  randomString(len) {
    if (!Number.isFinite(len)) {
      throw new TypeError('Expected a finite number');
    }

    return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
  },

  uuid,
  md5,
};

module.exports = Hash;
