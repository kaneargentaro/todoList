import {useState, FC} from 'react';
import UserInfo from './UserInfo';
import NoteList from './NoteList';
import NewNoteForm from './NewNoteForm';
import ErrorPortal from './ErrorPortal';

interface DashboardProps {
    token: string;
}

interface User {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
    updatedAt: string;
}

interface Note {
    id: string;
    message: string;
    createdAt: string;
    updatedAt: string;
}

const Dashboard: FC<DashboardProps> = ({token}) => {
    const [user, setUser] = useState<User | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [error, setError] = useState<string>('');

    const loadData = async () => {
        setError('');
        try {
            const resUser = await fetch('http://localhost:3000/user', {
                headers: {Authorization: `Bearer ${token}`},
            });
            if (resUser.ok) {
                const userData = await resUser.json();
                setUser(userData);
            }
            const resNotes = await fetch('http://localhost:3000/notes', {
                headers: {Authorization: `Bearer ${token}`},
            });
            if (resNotes.ok) {
                const notesData = await resNotes.json();
                setNotes(notesData);
            }
        } catch (err) {
            setError('Error loading data');
            console.log(err);
        }
    };

    // Data is loaded on button click rather than on mount.
    const handleRefresh = () => {
        loadData();
    };

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            <button onClick={handleRefresh}>Refresh Data</button>
            {error && <ErrorPortal message={error}/>}
            {user && <UserInfo user={user}/>}
            <NoteList notes={notes}/>
            <NewNoteForm token={token} onNoteAdded={handleRefresh}/>
        </div>
    );
};

export default Dashboard;
