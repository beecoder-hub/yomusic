import { useEffect, useState } from 'react';
import { MdCloudDownload } from 'react-icons/md';
import { checkForUpdate } from '../utils/checkForUpdate';

const UpdateBlock = () => {
  const [isupdateAvailable, setisupdateAvailable] = useState(false);
  useEffect(() => {
    checkForUpdate().then((data) => {
      if (data && data.version) {
        setisupdateAvailable(true);
      }
    });
  }, []);

  return isupdateAvailable && <MdCloudDownload className="size-6 me-4" />;
};

export default UpdateBlock;
