import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { ContactForm, Filter, ContactList } from './components';
import { saveToStorage, loadFromStorage } from './utils';
import { DATA_TO_LOAD, DATA_TO_SAVE } from './utils/constants';
import { Wrapper, PageHeader, SectionHeader } from './App.styled';

export default function App() {
  const [contacts, setContacts] = useState(() => loadFromStorage(DATA_TO_LOAD));
  const [filter, setFilter] = useState('');

  const filteredContacts = useCallback(() => {
    return contacts.filter(({ name }) => {
      return name.toLowerCase().includes(filter.toLowerCase());
    });
  }, [contacts, filter]);

  useEffect(() => {
    saveToStorage(DATA_TO_SAVE, contacts);
  }, [contacts]);

  useEffect(() => {
    const filterNotEmpty = filter;
    const noFilteredContactsAvailable = filteredContacts().length === 0;

    setFilter(filter);

    if (filterNotEmpty && noFilteredContactsAvailable) {
      window.confirm(`No search results for "${filter}", clear filter?`) &&
        setFilter('');
    }
  }, [filter, filteredContacts]);

  function handleFilterInputChange(e) {
    setFilter(e.target.value);
  }

  function checkDuplicatedContacts(validatedName) {
    return contacts.find(
      ({ name }) => name.toLowerCase() === validatedName.toLowerCase(),
    );
  }

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
          return [newContact, ...prevState];
        });
  }

  function deleteContact(id) {
    setContacts(prevState => prevState.filter(contact => contact.id !== id));
  }

  return (
    <Wrapper>
      <PageHeader>Phonebook</PageHeader>
      <ContactForm onSubmit={addContact} />
      <SectionHeader>Contacts</SectionHeader>
      <Filter value={filter} onChange={handleFilterInputChange}>
        Find contacts by name
      </Filter>
      <ContactList
        contacts={filteredContacts()}
        deleteContact={deleteContact}
      />
    </Wrapper>
  );
}
