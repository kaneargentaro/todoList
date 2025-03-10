import {FC} from 'react';

interface User {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
    updatedAt: string;
}

interface UserInfoProps {
    user: User;
}

const UserInfo: FC<UserInfoProps> = ({user}) => {
    return (
        <div className="user-info">
            <h3>User Information</h3>
            <p>Email: {user.email}</p>
            {user.name && <p>Name: {user.name}</p>}
            <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
    );
};

export default UserInfo;
