import {promises as fsp} from 'fs'

const compose = (f, g) => (a) => f(g(a))
const justParseInt = (e) => Number.parseInt(e)
const isStringANumber = compose(Number.isInteger, Number.parseInt)

const replacer = (string, replacements) => {
    let clonedString = (new String(string)).toString() // string is a class lmao
    for (const [before, after] of Object.entries(replacements)) {
		clonedString = clonedString.replaceAll(before, after)
	}

	return clonedString
}

const stringNumbersToNumberNumbers = {
	'one': 'o1ne',
	'two': 't2wo',
	'three': 'th3re',
	'four': 'fo4ur', 
	'five': 'fi5ve',
	'six': 's6x',
	'seven': 'se7en', // go vought
	'eight': 'ei8ht',
	'nine': 'ni9ne'
}


const file = await fsp.readFile('./1.input')
const all = file.toString()
const onlyNumbered = replacer(all, stringNumbersToNumberNumbers)
const lines = onlyNumbered.split('\n')
const numbers = lines.map((line) => line.split('').filter(isStringANumber))

const wantedNumbers = numbers
	.map(n => ([ n[0], n[n.length - 1] ]))
	.map(n => (n[0] + n[1]))
	.map(justParseInt) // Number.parseInt/3 sucks
	.filter( i => i ) //falsy values due to emptylines
	.reduce((acc, n) => acc + n)

console.log({wantedNumbers})
