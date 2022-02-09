import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';

import { Section, ContactForm, Filter, ContactList } from './components';
import { saveToStorage, loadFromStorage } from './utils';

import { Wrapper, PageHeader } from './App.styled';

export default function App() {
  const [contacts, setContacts] = useState(() => loadFromStorage('contacts'));
  const [filter, setFilter] = useState('');

  const filteredContacts = useCallback(() => {
    return contacts.filter(contact => {
      return contact.name.toLowerCase().includes(filter.toLowerCase());
    });
  }, [contacts, filter]);

  useEffect(() => {
    saveToStorage('contacts', contacts);
  }, [contacts]);

  useEffect(() => {
    setFilter(() => {
      if (filter && filteredContacts().length === 0) {
        console.log('filter', filter);
        return window.confirm(
          `No more search results for "${filter}", clear filter?`,
        )
          ? ''
          : filter;
      }
      return filter;
    });
  }, [filter, filteredContacts]);

  function addContact(newName, newNumber) {
    const newContact = {
      id: nanoid(),
      name: newName,
      number: newNumber,
    };
    const { name } = newContact;

    checkDuplicatedContacts(name)
      ? alert(`${name} is already in contacts`)
      : setContacts(prevState => {
          return prevState ? [newContact, ...prevState] : [newContact];
        });
  }

  function deleteContact(id) {
    setContacts(prevState => prevState.filter(contact => contact.id !== id));
  }

  function checkDuplicatedContacts(validatedName) {
    return contacts.find(
      contact => contact.name.toLowerCase() === validatedName.toLowerCase(),
    );
  }

  function handleFilterInputChange(e) {
    setFilter(e.target.value);
  }

  return (
    <Wrapper>
      <PageHeader>Phonebook</PageHeader>
      <ContactForm onSubmit={addContact} />
      <Section header="Contacts">
        <Filter value={filter} onChange={e => handleFilterInputChange(e)}>
          Find contacts by name
        </Filter>
        <ContactList
          contacts={filteredContacts()}
          deleteContact={deleteContact}
        />
      </Section>
    </Wrapper>
  );
}
