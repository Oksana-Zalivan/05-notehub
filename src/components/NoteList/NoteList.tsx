import css from './NoteList.module.css';
import type { Note } from '../../types/note';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';

interface NoteListProps {
    notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: string) => deleteNote(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });

    return (
        <ul className={css.list}>
            {notes.map((note) => (
                <li className={css.listItem} key={note.id}>
                    <div>
                        <h2 className={css.title}>{note.title}</h2>
                        <p className={css.content}>{note.content}</p>
                    </div>

                    <div className={css.footer}>
                        <span className={css.tag}>{note.tag}</span>
                        <button
                            className={css.button}
                            type="button"
                            onClick={() => mutation.mutate(note.id)}
                            disabled={mutation.isPending}
                        >
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}

