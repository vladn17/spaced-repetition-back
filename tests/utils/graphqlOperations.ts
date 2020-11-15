export const LOGIN = `
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const SIGNUP = `
  mutation signUp($email: String!, $password: String!) {
    signUp(email: $email, password: $password)
  }
`;

export const CREATE_DECK = `
  mutation createDeck($input: CreateDeckInput!) {
    createDeck(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_DECK = `
  mutation updateDeck($input: UpdateDeckInput!) {
    updateDeck(input: $input) {
      id
      name
    }
  }
`;

export const DELETE_DECK = `
  mutation deleteDeck($input: DeleteDeckInput!) {
    deleteDeck(input: $input)
  }
`;

export const CREATE_CARD = `
  mutation createCard($input: CreateCardInput!) {
    createCard(input: $input) {
      id
      question
      answer
      date
      repetition
      interval
      factor
      deckId
    }
  }
`;

export const DELETE_CARD = `
  mutation deleteCard($input: DeleteCardInput!) {
    deleteCard(input: $input)
  }
`;

export const GET_DECKS = `
  query getDecks {
    getDecks {
      id
      name
    }
  }
`;

export const GET_CARDS = `
  query getCards($input: GetCardsInput!) {
    getCards(input: $input) {
      id
      question
      answer
      date
      repetition
      interval
      factor
      deckId
    }
  }
`;

export const SCHEDULE_CARD = `
  mutation scheduleCard($input: ScheduleCardInput!) {
    scheduleCard(input: $input) {
      id
      date
      repetition
      interval
      factor
    }
  }
`;

export const EDIT_CARD = `
  mutation editCard($input: EditCardInput!) {
    editCard(input: $input) {
      id
      question
      answer
    }
  }
`;
