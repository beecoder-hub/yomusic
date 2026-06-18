import { MdPolicy } from 'react-icons/md';
import { useDataStore } from '../../zustand/app_data_store';
import Priv_Pol_Component from '../../components/Priv_Pol_Component';

const PirvacyPolicy = () => {
  const { setglobalDialogData, globalDialogData } = useDataStore();

  const closeDialog = () => {
    setglobalDialogData({ ...globalDialogData, isOpen: false });
  };
  function openPrivPolicy() {
    setglobalDialogData({
      isOpen: true,
      title: 'Privacy Policy',
      ok: {
        okText: 'Ok',
        onOk: closeDialog,
      },
      cancel: {
        cancelText: 'Cancel',
        onCancel: closeDialog,
      },
      children: (
        <div className="max-h-80 text-xs overflow-y-auto">
          <Priv_Pol_Component />
        </div>
      ),
    });
  }
  return (
    <div className="flex gap-4 items-center py-2 rounded-lg" onClick={openPrivPolicy}>
      <MdPolicy size={24} />
      <div className="info w-full">
        <div className="title  font-semibold">Privacy Policy</div>
      </div>
    </div>
  );
};

export default PirvacyPolicy;
