import { getConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../src/users/user.entity';
import { Deck } from '../../src/decks/deck.entity';
import { Card } from '../../src/cards/card.entity';

export async function seedData(): Promise<void> {
  const connection = getConnection();
  const users = [
    { email: 'test@mail.com', password: 'vladuser' },
    { email: 'test2@mail.com', password: 'user' },
    { email: 'test3@mail.com', password: 'qwe' },
  ];
  for (const user of users) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  const createdUsers = await connection
    .createQueryBuilder()
    .insert()
    .into(User)
    .values(users)
    .execute();
  const userId = createdUsers.identifiers[0].id;

  const decks = [
    { name: 'first deck', userId },
    { name: 'second deck', userId },
    { name: 'third deck', userId },
  ];
  const createdDecks = await connection
    .createQueryBuilder()
    .insert()
    .into(Deck)
    .values(decks)
    .execute();
  const deckId = createdDecks.identifiers[0].id;
  const cards = [
    {
      question: 'question',
      answer: 'answer',
      date: String(Date.now()),
      repetition: 1,
      interval: '0',
      factor: 2.5,
      deckId,
    },
    {
      question: 'wisdom',
      answer: 'мудрость',
      date: String(Date.now()),
      repetition: 1,
      interval: '0',
      factor: 2.5,
      deckId,
    },
    {
      question: 'kingdom',
      answer: 'королевство',
      date: String(Date.now()),
      repetition: 1,
      interval: '0',
      factor: 2.5,
      deckId,
    },
  ];
  await connection
    .createQueryBuilder()
    .insert()
    .into(Card)
    .values(cards)
    .execute();
}
