import React, { FunctionComponent, useCallback, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authenticationService from '../services/authentication.services';
import accountService from '../services/account.services';

import "./Login.scss"

const LoginPage: FunctionComponent = function () {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleChange = useCallback((setter: (value: string) => void) => (e: FormEvent<HTMLInputElement>) => {
        setter(e.currentTarget.value);
    }, []);

    const login = useCallback(async (e: FormEvent) => {
        e.preventDefault();

        await authenticationService.authenticate(userName, password);
        return navigate('/dashboard');

    }, [navigate, userName, password]);

    const createAccount = useCallback(async (e: FormEvent) => {
        e.preventDefault();

        await accountService.createAccount({ userName: userName, password: password });
        return navigate('/dashboard');

    }, [navigate, userName, password]);

    return (
        <div className="login-container">
            <div className="login-form decorations">
                <form onSubmit={login}>
                    <label>Nom d'utilisateur</label>
                    <input name="userName" type="text" placeholder="Nom d'utilisateur" value={userName} onChange={handleChange(setUserName)} autoComplete="off" />
                    <label>Mot de passe</label>
                    <input name="password" type="password" placeholder="Mot de passe" value={password} onChange={handleChange(setPassword)} />

                    <button type="submit">Connexion</button>
                    <button onClick={createAccount}>Créer</button>
                </form>
            </div>
        </div>
    );

}

export default LoginPage;
