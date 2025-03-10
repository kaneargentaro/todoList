import {FC, FormEvent, useRef, useState} from 'react';

interface LoginFormProps {
    onLogin: (token: string) => void;
}

const LoginForm: FC<LoginFormProps> = ({onLogin}) => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        if (!email || !password) {
            setError('Please fill in both fields');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Login failed');
            } else {
                onLogin(data.token);
            }
        } catch (err) {
            console.error(err);
            setError('Login error');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input ref={emailRef} type="email" placeholder="Email" required/>
                <input ref={passwordRef} type="password" placeholder="Password" required/>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
