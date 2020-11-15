
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface CreateCardInput {
    question: string;
    answer: string;
    date: string;
    deckId: string;
}

export interface EditCardInput {
    id: string;
    question: string;
    answer: string;
}

export interface ScheduleCardInput {
    id: string;
    date: string;
    repetition: number;
    interval: string;
    factor: number;
}

export interface DeleteCardInput {
    id: string;
}

export interface DeleteDeckInput {
    deckId: string;
}

export interface UpdateDeckInput {
    deckId: string;
    name: string;
}

export interface CreateDeckInput {
    name: string;
}

export interface GetCardsInput {
    deckId: string;
}

export interface Deck {
    __typename?: 'Deck';
    id: string;
    name: string;
}

export interface Card {
    __typename?: 'Card';
    id: string;
    question: string;
    answer: string;
    date: string;
    repetition: number;
    interval: string;
    factor: number;
    deckId: string;
}

export interface EditCardPayload {
    __typename?: 'EditCardPayload';
    id: string;
    question: string;
    answer: string;
}

export interface ScheduleCardPayload {
    __typename?: 'ScheduleCardPayload';
    id: string;
    date: string;
    repetition: number;
    interval: string;
    factor: number;
}

export interface IQuery {
    __typename?: 'IQuery';
    getDecks(): Deck[] | Promise<Deck[]>;
    getCards(input: GetCardsInput): Card[] | Promise<Card[]>;
}

export interface IMutation {
    __typename?: 'IMutation';
    login(email: string, password: string): string | Promise<string>;
    signUp(email: string, password: string): string | Promise<string>;
    createDeck(input: CreateDeckInput): Deck | Promise<Deck>;
    updateDeck(input: UpdateDeckInput): Deck | Promise<Deck>;
    deleteDeck(input: DeleteDeckInput): string | Promise<string>;
    createCard(input: CreateCardInput): Card | Promise<Card>;
    deleteCard(input: DeleteCardInput): string | Promise<string>;
    editCard(input: EditCardInput): EditCardPayload | Promise<EditCardPayload>;
    scheduleCard(input: ScheduleCardInput): ScheduleCardPayload | Promise<ScheduleCardPayload>;
}
