import {useRef, useState, FC, FormEvent} from 'react';
import config from '../config';

interface NewNoteFormProps {
    token: string;
    onNoteAdded: () => void;
}

const NewNoteForm: FC<NewNoteFormProps> = ({token, onNoteAdded}) => {
    const noteRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const message = noteRef.current?.value;
        if (!message) {
            setError('Please enter a note.');
            return;
        }
        try {
            const res = await fetch(`${config.apiUrl}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({message}),
            });
            if (!res.ok) {
                setError('Failed to add note');
            } else {
                noteRef.current!.value = '';
                onNoteAdded();
            }
        } catch (err) {
            setError('Error adding note');
            console.error(err);
        }
    };

    return (
        <div className="new-note-form">
            <h3>Add New Note</h3>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input ref={noteRef} type="text" placeholder="Enter note" required/>
                <button type="submit">Add Note</button>
            </form>
        </div>
    );
};

export default NewNoteForm;
