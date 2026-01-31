import { useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import "./App.css";

import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import type { NoteFormValues } from '../NoteForm/NoteForm';

import { createNote, deleteNote, fetchNotes } from '../../services/noteService';

const PER_PAGE = 12;

export default function App() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setPage(1);
    setSearch(value.trim());
  }, 400);

  const onSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const queryKey = useMemo(() => ['notes', page, search], [page, search]);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey,
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const createMutation = useMutation({
    mutationFn: (values: NoteFormValues) =>
      createNote({ title: values.title, content: values.content, tag: values.tag }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return (
    <div className="app">
      <header className="toolbar">
        <SearchBox value={searchInput} onChange={onSearchChange} />

        {totalPages > 1 && (
          <Pagination pageCount={totalPages} page={page} onPageChange={setPage} />
        )}

        <button className="button" type="button" onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isFetching && !isLoading && <p>Updating...</p>}

      {isError && (
        <p>
          Error:{' '}
          {error instanceof Error ? error.message : 'Something went wrong'}
        </p>
      )}

      {notes.length > 0 && (
        <NoteList notes={notes} />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
