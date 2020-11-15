import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Card } from '../cards/card.entity';
import { User } from '../users/user.entity';

@Entity()
export class Deck {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  userId!: string;

  @ManyToOne((type) => User, (user) => user.decks)
  user!: User;

  @OneToMany((type) => Card, (card) => card.deck)
  cards!: Card[];
}
