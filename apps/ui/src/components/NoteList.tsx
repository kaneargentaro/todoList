import {FC} from 'react';

interface Note {
    id: string;
    message: string;
    createdAt: string;
    updatedAt: string;
}

interface NoteListProps {
    notes: Note[];
}

const NoteList: FC<NoteListProps> = ({notes}) => {
    return (
        <div className="note-list">
            <h3>Notes</h3>
            {notes.length === 0 ? (
                <p>No notes available.</p>
            ) : (
                <ul>
                    {notes.map(note => (
                        <li key={note.id}>{note.message}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NoteList;
