import { readFile } from 'fs/promises'

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

const partial: (fn: Function, firstArg: unknown) => (lastArgs: unknown[]) => Function = (fn, firstArg) => { return (...lastArgs) => { return fn(firstArg, ...lastArgs); } }

const stringToShow: (show: string) => Show = (show) => {

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

  }).reduce((acc, partialShow) => ({ ...acc, ...partialShow }))
}

const stringToGame: (game: string) => Game = (game) => {
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

const findMaximumCubes: (game: Game, color: 'red' | 'green' | 'blue') => number = (game, color) => {

  const numberOfCubes = game.shows.map(show => (show[color] || 0))
  return Math.max(...numberOfCubes)
}

const minCubesForGame: (game: Game) => Show = (game) => {
  const result: Show = {
    red: findMaximumCubes(game, 'red'),
    green: findMaximumCubes(game, 'green'),
    blue: findMaximumCubes(game, 'blue')
  }

  return result
}

const allGames = file.toString().split('\n').filter(i => i)


const games = allGames.map(stringToGame)
const minCubes = games.map(minCubesForGame)
console.log({ minCubes })

const poweredGames = minCubes.map((show) => ((show.red || 1) * (show.green || 1) * (show.blue || 1)))
const sum = poweredGames.reduce((acc, power) => acc + power)

console.log({ sum })



