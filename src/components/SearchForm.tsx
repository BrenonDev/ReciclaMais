import { Search } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';

interface SearchFormProps {
  initialValue?: string;
  onSearch(query: string): void;
}

/** Requisito 1: o usuário descreve o que quer descartar com as próprias palavras. */
export function SearchForm({ initialValue = '', onSearch }: SearchFormProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(false);

  useEffect(() => setValue(initialValue), [initialValue]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const query = value.trim();
    setError(!query);
    if (query) onSearch(query);
  }

  return (
    <form className="search-form" role="search" onSubmit={handleSubmit} noValidate>
      <label htmlFor="descricao" className="search-form__label">O que você quer descartar?</label>
      <div className="search-form__row">
        <input
          id="descricao"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ex.: tenho uma pilha"
          autoComplete="off"
          enterKeyHint="search"
          aria-invalid={error}
          aria-describedby={error ? 'descricao-erro' : undefined}
        />
        <button type="submit" className="button button--primary">
          <Search aria-hidden="true" size={20} />
          Buscar
        </button>
      </div>
      {error && <p id="descricao-erro" className="field-error">Escreva o que você quer descartar.</p>}
    </form>
  );
}
