import {promises as fsp} from 'fs'

const compose = (f, g) => (a) => f(g(a))
const justParseInt = (e) => Number.parseInt(e)
const isStringANumber = compose(Number.isInteger, Number.parseInt)

const file = await fsp.readFile('./1.input')
const lines = file.toString().split('\n')
const numbers = lines.map((line) => line.split('').filter(isStringANumber))

debugger
const wantedNumbers = numbers
	.map(n => ([ n[0], n[n.length - 1] ]))
	.map(n => (n[0] + n[1]))
	.map(justParseInt) // Number.parseInt/3 sucks
	.filter( i => i ) //falsy values due to emptylines
	.reduce((acc, n) => acc + n)
console.log(wantedNumbers)

