import { MdHistory } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const HistoryC = () => {
  const navigate = useNavigate();
  return (
    <div
      className="flex gap-4 items-center py-2 rounded-lg"
      onClick={() => {
        navigate('/history');
      }}
    >
      <MdHistory size={24} />
      <div className="info w-full">
        <div className="title  font-semibold">History</div>
      </div>
    </div>
  );
};

export default HistoryC;
