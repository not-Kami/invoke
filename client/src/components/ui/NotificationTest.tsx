import React from 'react';
import Button from './Button';
import { useNotifications } from '../../hooks/useNotifications';

const NotificationTest: React.FC = () => {
  const { addSuccess, addError, addInfo } = useNotifications();

  return (
    <div className="p-4 space-y-4 bg-slate-800 rounded-lg">
      <h3 className="text-lg font-semibold text-white">Test des notifications</h3>
      <div className="flex space-x-2">
        <Button onClick={() => addSuccess('Opération réussie !')} variant="primary">
          Succès
        </Button>
        <Button onClick={() => addError('Une erreur est survenue !')} variant="danger">
          Erreur
        </Button>
        <Button onClick={() => addInfo('Information importante')} variant="outline">
          Info
        </Button>
      </div>
    </div>
  );
};

export default NotificationTest;
