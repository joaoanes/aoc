import {readFile} from 'fs/promises'

const file = await readFile("./2.input")

type Show = {
  green?: number,
  red?: number,
  blue?: number,
}

type Game = {
  number: number,
  shows: Show[],
}

const partial : (fn : Function, firstArg: unknown) => (lastArgs: any | any[]) => any = (fn, firstArg) => {  return (...lastArgs) => {    return fn(firstArg, ...lastArgs);  }}

const stringToShow : (show: string) => Show = (show) => {
  const showStrings = show.split(',')
  return showStrings.map((string) => {    
    const colors = ['red', 'green', 'blue']
    return colors.reduce((acc, color) => {
      const searchedColor = string.match(`(\\d+) ${color}`)
      if (searchedColor !== null) {
        acc[color] = Number.parseInt(searchedColor[1])
      } 
      return acc
    }, {}) as Show
  }).reduce((acc, partialShow) => ({...acc, ...partialShow}))
}

const stringToGame : (game: string) => Game = (game) => {
  const numberMatch = game.match(/Game (\d*):/)
  if (numberMatch === null) {
    throw new Error("hey what's up here " + game)
  }
  const number = numberMatch[1]
  const showsString = game.substring((numberMatch.index as number) + numberMatch[0].length)
    
  return {
    number: Number.parseInt(number),
    shows: showsString.split(';').map(stringToShow)
  }
    
}

const compare : (left: Show, right: Show) => boolean = (left, right) => {
  for (const color in left) {
    if (left[color] < right[color]) { 
      return false 
      }
    }

  return true
}

const validate : (standard: Show, game: Game) => boolean = (standard, game) => (
  game.shows.every(partial(compare, standard))
)

const allGames = file.toString().split('\n').filter(i => i)
const games = allGames.map(stringToGame)

const STANDARD : Show = { red: 12, green: 13, blue: 14 }

const isValidGame = partial(validate, STANDARD)

const validGames = games.filter(isValidGame)
const wantedNumber = validGames.reduce((acc, game) => acc + game.number, 0)
console.log({wantedNumber})

