import { useDataStore } from '../../zustand/app_data_store';
import { Dialog, DialogButton } from 'konsta/react';

const GlobalDialog = () => {
  const { globalDialogData, setglobalDialogData } = useDataStore();
  const closeDialog = () => {
    setglobalDialogData({ ...globalDialogData, isOpen: false }); // close dialog
  };

  return (
    <Dialog
      className="w-9/10"
      opened={globalDialogData.isOpen}
      onBackdropClick={() => {
        globalDialogData.onClose ? globalDialogData.onClose() : closeDialog();
      }}
      title={globalDialogData.title ? globalDialogData.title : ''}
      content={
        globalDialogData.subtitle
          ? globalDialogData.subtitle
          : globalDialogData.children
            ? globalDialogData.children
            : ''
      }
      buttons={
        <>
          {globalDialogData.cancel && (
            <DialogButton
              onClick={() => {
                globalDialogData.cancel?.onCancel
                  ? globalDialogData.cancel?.onCancel()
                  : closeDialog();
              }}
            >
              {globalDialogData.cancel.cancelText}
            </DialogButton>
          )}

          {globalDialogData.ok && (
            <DialogButton
              strong
              onClick={() => {
                globalDialogData.ok?.onOk ? globalDialogData.ok?.onOk() : closeDialog();
              }}
            >
              {globalDialogData.ok.okText}
            </DialogButton>
          )}
        </>
      }
    />
  );
};

export default GlobalDialog;
