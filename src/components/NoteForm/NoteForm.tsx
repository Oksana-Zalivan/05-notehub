import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';
import type { NoteTag } from '../../types/note';

interface NoteFormProps {
    onCancel: () => void;
    onSubmit: (values: NoteFormValues) => Promise<void> | void;
    isSubmitting?: boolean;
}

export interface NoteFormValues {
    title: string;
    content: string;
    tag: NoteTag;
}

const validationSchema = Yup.object({
    title: Yup.string().min(3).max(50).required('Title is required'),
    content: Yup.string().max(500, 'Max 500 symbols'),
    tag: Yup.mixed<NoteTag>()
        .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
        .required('Tag is required'),
});

const initialValues: NoteFormValues = {
    title: '',
    content: '',
    tag: 'Todo',
};

export default function NoteForm({
    onCancel,
    onSubmit,
    isSubmitting,
}: NoteFormProps) {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, actions) => {
                await onSubmit(values);
                actions.resetForm();
            }}
        >
            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor="title">Title</label>
                    <Field id="title" name="title" type="text" className={css.input} />
                    <ErrorMessage name="title" component="span" className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="content">Content</label>
                    <Field
                        as="textarea"
                        id="content"
                        name="content"
                        rows={8}
                        className={css.textarea}
                    />
                    <ErrorMessage name="content" component="span" className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="tag">Tag</label>
                    <Field as="select" id="tag" name="tag" className={css.select}>
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                    <ErrorMessage name="tag" component="span" className={css.error} />
                </div>

                <div className={css.actions}>
                    <button
                        type="button"
                        className={css.cancelButton}
                        onClick={onCancel}
                        disabled={Boolean(isSubmitting)}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className={css.submitButton}
                        disabled={Boolean(isSubmitting)}
                    >
                        Create note
                    </button>
                </div>
            </Form>
        </Formik>
    );
}
