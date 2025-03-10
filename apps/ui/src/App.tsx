import {useState} from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

function App() {
    // Only token state is maintained here.
    const [token, setToken] = useState<string>('');

    return (
        <div>
            {token ? (
                <Dashboard token={token}/>
            ) : (
                <LoginForm onLogin={setToken}/>
            )}
        </div>
    );
}

export default App;
