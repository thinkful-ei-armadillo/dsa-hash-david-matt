'use strict';

class HashMap {
  constructor(initialCapacity = 8) {
    this.length = 0;
    this._hashTable = [];
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  get(key) {
    const index = this._findSlot(key);
    if (this._hashTable[index] === undefined) {
      throw new Error('Key error');
    }
    return this._hashTable[index].value;
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > this.MAX_LOAD_RATIO) {
      this._resize(this._capacity * this.SIZE_RATIO);
    }
    //Find the slot where this key should be in
    const index = this._findSlot(key);

    if (!this._hashTable[index]) {
      this.length++;
    }
    this._hashTable[index] = {
      key,
      value,
      DELETED: false
    };
  }

  delete(key) {
    const index = this._findSlot(key);
    const slot = this._hashTable[index];
    if (slot === undefined) {
      throw new Error('Key error');
    }
    slot.DELETED = true;
    this.length--;
    this._deleted++;
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const start = hash % this._capacity;

    for (let i = start; i < start + this._capacity; i++) {
      const index = i % this._capacity;
      const slot = this._hashTable[index];
      if (slot === undefined || (slot.key === key && !slot.DELETED)) {
        return index;
      }
    }
  }

  _resize(size) {
    const oldSlots = this._hashTable;
    this._capacity = size;
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._deleted = 0;
    this._hashTable = [];

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.DELETED) { // this was originally !slot.deleted
        this.set(slot.key, slot.value);
      }
    }
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i = 0; i < string.length; i++) {
      //Bitwise left shift with 5 0s - this would be similar to
      //hash*31, 31 being the decent prime number
      //but bit shifting is a faster way to do this
      //tradeoff is understandability
      hash = (hash << 5) + hash + string.charCodeAt(i);
      //converting hash to a 32 bit integer
      hash = hash & hash;
    }
    //making sure has is unsigned - meaning non-negtive number. 
    return hash >>> 0;
  }
}

const WhatDoesThisDo = function(){
  let str1 = 'Hello World.';
  let str2 = 'Hello World.';
  let map1 = new HashMap();
  map1.set(str1,10);
  map1.set(str2,20);
  let map2 = new HashMap();
  let str3 = str1;
  let str4 = str2;
  map2.set(str3,20);
  map2.set(str4,10);

  console.log(map1.get(str1));
  console.log(map2.get(str3));
};

function main() {
  const lor = new HashMap();
  lor.MAX_LOAD_RATIO = 0.5;
  lor.SIZE_RATIO = 3;

  lor.set('Hobbit','Bilbo');
  lor.set('Hobbit','Frodo');
  lor.set('Human','Aragon');
  lor.set('Wizard','Gandolf');
  lor.set('Elf','Legolas');
  lor.set('Maiar','Sauron');
  lor.set('LadyOfLight','Galadriel');
  lor.set('RingBearer','Gollum');
  lor.set('HalfElven','Arwen');
  lor.set('Ent','Treebeard');

  console.log(lor);
  console.log(lor.get('Hobbit'));

  // WhatDoesThisDo() 20 anb 10
}

// main();

// Maiar  = Sauron, and Hobbit is Frodo
// This is because Bilbo is overwritten because they have the same key. This is not a collision because 
// the keys are not unique

// Capacity is 24.. This is because the MAX Load ratio was met and the hash table got resized. 


// understanding hash maps:

// keys 10, 22, 31, 4, 15, 28, 17, 88, 59
// hash map length m = 11. Open addressing. Hash function: k mod m. 
// Expected output: [22, 88, null, null, 4, 15, 28, 17, 59, 31, 10]

// keys 5, 28, 19, 15, 20, 33, 12, 17, 10
// hash map length m = 9. Hash function: k mod m.
// Expected output: [null, head -> 28 -> 19 -> 10, 20, 12,null, 5, head -> 15 -> 33, 17,null]

function removeDup(str){
  const noDup = new Map();

  let result = '';
  for(let i = 0; i < str.length; i++){
    if(noDup.has(str[i])){
      result += '';
    }else {
      noDup.set(str[i], str[i]);
      result += str[i];
    }
  }
  console.log(result);
  return result;
}

// removeDup('google all that you think can think of');

function hasPalindrome(str){
  const letters = new Map();
  let singles = 0;
  for(let i = 0;i < str.length; i++){
    if(!letters.has(str[i])){
      singles++;
      letters.set(str[i]);
    } else {
      singles--;
      letters.delete(str[i]);
    }
  }
  if(singles > 1){
    return false;
  }
  return true;
}

// hasPalindrome('acecarr');
// hasPalindrome('norther');

function sortHelper(word) {
  return word.split('').sort().join('');
}

// Anagram grouping
function anagram(list) {
  const hm = new Map();

  for(let i = 0; i < list.length; i++) {
    const sorted = sortHelper(list[i]);
    const group = hm.get(sorted) || [];
    hm.set(sorted, [...group,list[i]]);
    
  }

  return Array.from(hm.values());
}


// console.log(anagram(['east', 'cars', 'acre', 'arcs', 'teas', 'eats', 'race']));

class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class HashMapChaining {
  constructor(initialCapacity = 8) {
    this.length = 0;
    this._hashTable = [];
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  get(key) {
    const index = this._findSlot(key);
    if (this._hashTable[index] === undefined) {
      throw new Error('Key error');
    }
    return this._hashTable[index].value;
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > this.MAX_LOAD_RATIO) {
      this._resize(this._capacity * this.SIZE_RATIO);
    }
    //Find the slot where this key should be in
    const index = this._findSlot(key);

    if (!this._hashTable[index]) {
      this.length++;
    }
    try {
      this.get(key)
      let currentNode = this._hashTable.head;
      while(!currentNode.next){
        currentNode = currentNode.next;
      }
      currentNode.next = new _Node(value);
    } catch(err) {
      const node = new _Node(value);
      this._hashTable[index] = {head: node};
    }
    // this._hashTable[index] = {
    //   key,
    //   value,
    //   DELETED: false
    // };
  }

  delete(key) {
    const index = this._findSlot(key);
    const slot = this._hashTable[index];
    if (slot === undefined) {
      throw new Error('Key error');
    }
    slot.DELETED = true;
    this.length--;
    this._deleted++;
  }

  _findSlot(key) {
    const hash = HashMapChaining._hashString(key);
    const index = hash % this._capacity;
    return index;
  }

  _resize(size) {
    const oldSlots = this._hashTable;
    this._capacity = size;
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._deleted = 0;
    this._hashTable = [];

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.DELETED) { // this was originally !slot.deleted
        this.set(slot.key, slot.value);
      }
    }
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i = 0; i < string.length; i++) {
      //Bitwise left shift with 5 0s - this would be similar to
      //hash*31, 31 being the decent prime number
      //but bit shifting is a faster way to do this
      //tradeoff is understandability
      hash = (hash << 5) + hash + string.charCodeAt(i);
      //converting hash to a 32 bit integer
      hash = hash & hash;
    }
    //making sure has is unsigned - meaning non-negtive number. 
    return hash >>> 0;
  }
}

function mainHashChain() {
  const lor = new HashMapChaining();
  lor.MAX_LOAD_RATIO = 0.5;
  lor.SIZE_RATIO = 3;

  lor.set('Hobbit','Bilbo');
  lor.set('Hobbit','Frodo');
  lor.set('Human','Aragon');
  // lor.set('Wizard','Gandolf');
  lor.set('Elf','Legolas');
  // lor.set('Maiar','Sauron');
  lor.set('LadyOfLight','Galadriel');
  lor.set('RingBearer','Gollum');
  lor.set('HalfElven','Arwen');
  // lor.set('Ent','Treebeard');

  console.log(lor._hashTable);
}

mainHashChain();
