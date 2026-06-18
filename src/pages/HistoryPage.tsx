import { List } from 'konsta/react';
import HistCard from '../components/cards/HistCard';
import { useDataStore } from '../zustand/app_data_store';
import { MdDelete, MdInfo } from 'react-icons/md';

const HistoryPage = () => {
  const { history, setHistory, setglobalDialogData, globalDialogData } = useDataStore();
  const showDelAll = () => {
    setglobalDialogData({
      isOpen: true,
      title: 'History',
      subtitle: 'Are you sure to clear your history?',
      ok: {
        okText: 'Delete',
        onOk: () => {
          setHistory([]);
          setglobalDialogData({ ...globalDialogData, isOpen: false });
        },
      },
      cancel: {
        cancelText: 'cancel',
      },
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <span className="title font-semibold text-lg my-4">History</span>
        {history && history.length > 0 && <MdDelete className="w-5 h-5" onClick={showDelAll} />}
      </div>
      {history && history.length <= 0 && (
        <p className="mt-4 bg-surface-variant backdrop-blur-sm p-1 rounded-xl h-16 xl:w-1/2 justify-center xl:justify-start flex  items-center">
          <MdInfo className="w-5 h-5 me-2" /> <span>No Items Found</span>
        </p>
      )}
      {/* LIST */}
      <List>
        {history &&
          history.length > 0 &&
          history.map((item, i) => <HistCard key={i} data={item} />)}
      </List>
    </div>
  );
};

export default HistoryPage;
