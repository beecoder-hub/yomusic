import { Dialog, DialogButton } from 'konsta/react';
import { useEffect, useState } from 'react';
import { useDataStore } from '../zustand/app_data_store';

const InternetChecker = () => {
  const [hasInternet, sethasInternet] = useState(true);
  const { setIsPlayerReady } = useDataStore();
  async function hasInternetAccess() {
    try {
      const response = await fetch('https://www.apple.com', {
        method: 'HEAD',
        cache: 'no-store',
      });
      return response.ok; // Returns true if it connects successfully
    } catch {
      return false;
    }
  }

  useEffect(() => {
    // Usage on startup
    setTimeout(() => {
      hasInternetAccess().then((isOnline) => {
        if (!isOnline) {
          sethasInternet(false);
          setIsPlayerReady(true); // to remove global laoding overlay
        }
      });
    }, 4000);
  }, []);

  return (
    !hasInternet && (
      <div>
        <Dialog
          className="w-9/10"
          opened={true}
          onBackdropClick={() => {}}
          title={'Error'}
          content={'Connection Error! Retry?'}
          buttons={
            <>
              <DialogButton
                strong
                onClick={() => {
                  window.location.reload();
                }}
              >
                Retry
              </DialogButton>
            </>
          }
        />
      </div>
    )
  );
};

export default InternetChecker;
