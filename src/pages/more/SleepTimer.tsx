// TODO COMMING SOON
import { MdLockClock } from 'react-icons/md';
import { useDataStore } from '../../zustand/app_data_store';

const SleepTimer = () => {
  const { setglobalDialogData } = useDataStore();
  function showAbout() {
    setglobalDialogData({
      isOpen: true,
      title: 'About',
      subtitle: 'Hello this is about dialog!',
      ok: {
        okText: 'Ok',
        onOk: () => {},
      },
      cancel: {
        cancelText: 'Cancel',
        onCancel: () => {},
      },
    });
  }
  return (
    <div className="flex gap-4 items-center py-2 rounded-lg" onClick={showAbout}>
      <MdLockClock size={24} />
      <div className="info w-full">
        <div className="title  font-semibold">Sleep timer</div>
      </div>
    </div>
  );
};

export default SleepTimer;
