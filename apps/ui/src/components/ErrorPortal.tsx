import {FC} from 'react';
import {createPortal} from 'react-dom';

interface ErrorPortalProps {
    message: string;
}

const ErrorPortal: FC<ErrorPortalProps> = ({message}) => {
    return createPortal(
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            background: 'red',
            color: 'white',
            padding: '10px',
            zIndex: 1000,
            textAlign: 'center'
        }}>
            {message}
        </div>,
        document.body
    );
};

export default ErrorPortal;
