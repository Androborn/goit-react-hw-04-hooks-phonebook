import { useState } from 'react';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';

import {
  ContactAddForm,
  NameLabel,
  NameInput,
  NumberLabel,
  NamberInput,
  SubmitBtn,
} from './ContactForm.styled';

export function ContactForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  const _nameInputId = nanoid();
  const _numberInputId = nanoid();

  function handleNameInputChange(e) {
    setName(e.target.value);
  }

  function handleNumberInputChange(e) {
    setNumber(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(name, number);
    resetForm();
  }

  function resetForm() {
    setName('');
    setNumber('');
  }

  return (
    <ContactAddForm onSubmit={handleSubmit}>
      <NameLabel htmlFor={_nameInputId}>Name</NameLabel>
      <NameInput
        type="text"
        name="name"
        pattern="^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$"
        title="Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan"
        required
        value={name}
        onChange={handleNameInputChange}
        id={_nameInputId}
      />
      <NumberLabel htmlFor={_numberInputId}>Number</NumberLabel>
      <NamberInput
        type="tel"
        name="number"
        pattern="\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}"
        title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
        required
        value={number}
        onChange={handleNumberInputChange}
        id={_numberInputId}
      />
      <SubmitBtn type={'submit'}>Add contact</SubmitBtn>
    </ContactAddForm>
  );
}

ContactForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
