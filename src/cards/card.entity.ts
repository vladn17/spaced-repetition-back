import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Deck } from '../decks/deck.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  question!: string;

  @Column()
  answer!: string;

  @Column()
  date!: string;

  @Column()
  repetition!: number;

  @Column()
  interval!: string;

  @Column('float')
  factor!: number;

  @Column()
  deckId!: string;

  @ManyToOne((type) => Deck, (deck) => deck.cards, {
    onDelete: 'CASCADE',
  })
  deck!: Deck;
}
