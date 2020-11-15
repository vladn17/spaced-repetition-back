import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Deck } from '../decks/deck.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @OneToMany((type) => Deck, (deck) => deck.user)
  decks!: Deck[];
}
