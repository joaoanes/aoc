import { readFile } from 'fs/promises'

type Card = {
  number: number,
  winners: number[],
  haves: number[]
}

type CardResult = {
  number: number,
  winnerResults: number[]
}

const stringToCard : (card: string) => Card = (card) => {
  const numberMatch = card.match(/Card\s+(\d*):/)
  if (numberMatch === null) {
    throw new Error("hey what's up here " + card)
  }
  const number = numberMatch[1]
  const numbersString = card.substring((numberMatch.index as number) + numberMatch[0].length)
  const splitNumbers = numbersString.split("|")
  const [winners, haves] = splitNumbers.map(someNumbers => someNumbers.split(" ").map(n => Number.parseInt(n)).filter(i => i))


  return {
    number: Number.parseInt(number),
    winners,
    haves
  }

}

const calculateWinningNumbers : (card : Card) => (CardResult) = (card) => ({
  number: card.number,
  winnerResults: card.winners.filter(winningNumber => card.haves.includes(winningNumber))
})

const calculateScore : (result : CardResult) => number = (result) => (
  result.winnerResults.length < 1 ? 0 : Math.pow(2, result.winnerResults.length - 1)
)

const cards = (await readFile("./4.input")).toString().split("\n").filter(i => i).map(stringToCard)

const cardResults = cards.map(calculateWinningNumbers)

const applyScore = (result) => ({...result, score: calculateScore(result)})
const score = cardResults.reduce((acc, result) => acc + calculateScore(result), 0)
console.log({cards, cardResults: cardResults.map(applyScore), score})
