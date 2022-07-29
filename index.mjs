import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
import { ask, yesno } from '@reach-sh/stdlib/ask.mjs';

const stdlib = loadStdlib();

const Alice = "Alice"
const Bob = "Bob"

const accAlice = await stdlib.newTestAccount(stdlib.parseCurrency(10000));
const accBob = await stdlib.newTestAccount(stdlib.parseCurrency(1200));


const ctcAlice = accAlice.contract(backend);

const ctcBob = accBob.contract(backend, ctcAlice.getInfo())
console.log(`Hello ${Alice} and ${Bob}`)
console.log(`We have players ${Alice} and ${Bob} participating in the vault game`)


const Aliceaccbal = await stdlib.balanceOf(accAlice);
const Bobaccbal = await stdlib.balanceOf(accBob);

console.log(`Alice has ${stdlib.formatCurrency(Aliceaccbal)} ${stdlib.standardUnit} tokens`)
console.log(`Bob has ${stdlib.formatCurrency(Bobaccbal)} ${stdlib.standardUnit} tokens`)
const cash = await ask(`${Alice} enter funds for contract`)
const lob = await ask(`${Alice} enter the length of blocks`)
await Promise.all([
    ctcAlice.p.Alice({
        funds: stdlib.parseCurrency(parseInt(cash)),
        lenofblocks: parseInt(lob),
        State: async () => {
            const state = parseInt(await ask(`what is ${Alice} state:  `))
            if (state === 0) {
                console.log(`${Alice} isn't there `)
                return false
            } else if (state === 1) {
                console.log(`${Alice} is around`)
                return true
            }

        },
        Seetimeout: async (num) => {
            console.log(`${Alice} the timeout is ${num} `)
        },

    }),
    ctcBob.p.Bob({
        acceptfunds: async (amt) => {
            console.log(`${Bob} saw the deposit of ${amt}`)
            const accp = parseInt(await ask(`${Bob} do you accept the terms of this game\n enter 1 for yes and 0 for no: `))
            if (accp == 1) {
                console.log(`${Bob} accepts the terms of the game`)
                return true
            } else {
                console.log(`${Bob} doesn't accepts the terms of the game and opted out`)
                return false
            }
        },
        Seetimeout: async (num2) => {
            console.log(`${Bob} the timeout is ${num2} `)
        },
    }),

]);

const Aliceaccbal_after = await stdlib.balanceOf(accAlice);
const Bobaccbal_after = await stdlib.balanceOf(accBob);

console.log(`Alice has ${stdlib.formatCurrency(Aliceaccbal_after)} ${stdlib.standardUnit} tokens`)
console.log(`Bob has ${stdlib.formatCurrency(Bobaccbal_after)} ${stdlib.standardUnit} tokens`)
process.exit()
