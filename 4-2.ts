import { readFile } from 'fs/promises'

type Card = {
  number: number,
  winners: number[],
  haves: number[]
}

type ProcessedCard = {
  number: number,
  winnerResults: number[]
}

type CardBundle = {
  copies: number, 
  processedCard: ProcessedCard
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

const calculateWinningNumbers : (card : Card ) => (ProcessedCard) = (card) => ({
  number: card.number,
  winnerResults: card.winners.filter(winningNumber => card.haves.includes(winningNumber))
})

const distribute : (bundles: CardBundle[], index: number, howMuch: number) => void = (bundle, index, howMuch) => {
  if (howMuch === 0) {
    return 
  }
  const {copies, processedCard} = bundle[index + 1]
  bundle[index + 1] = {copies: copies + 1, processedCard}
  distribute(bundle, index + 1, howMuch - 1)
}

const parseWinnings : (copy : CardBundle, index: number, copies: CardBundle[]) => void = (copy, index, copies) => {
  for (let numCopies = copy.copies; numCopies != 0; --numCopies) {
    distribute(copies, index, copy.processedCard.winnerResults.length)
  }
  return copy
}

const cards = (await readFile("./4.input")).toString().split("\n").filter(i => i).map(stringToCard)
const processedCards = cards.map(calculateWinningNumbers)
const bundles : CardBundle[] = processedCards.map(processedCard => ({ copies: 1, processedCard }))

bundles.forEach(parseWinnings)

const sum = bundles.reduce((sum, { copies }) => sum + copies, 0)

console.log({bundles, sum})
