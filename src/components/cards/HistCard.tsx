import { useDataStore } from '../../zustand/app_data_store';
import { useNavigate } from 'react-router-dom';
import { useLongPress } from '../../hooks/useLongPress';
import { Toast } from '@capacitor/toast';
import type { VideoType } from '../../types';
import { ListItem } from 'konsta/react';

const HistCard = ({ data: { videoId, title, channel } }: { data: VideoType }) => {
  const navigate = useNavigate();
  const { history, setHistory, globalDialogData, setglobalDialogData, setGlobalQueue } =
    useDataStore();
  const closeDialog = () => {
    setglobalDialogData({ ...globalDialogData, isOpen: false });
  };
  const bindLongPress = useLongPress(() => {
    setglobalDialogData({
      isOpen: true,
      title: 'Remove',
      subtitle: 'Are You Sure to Remove?',
      ok: {
        okText: 'Ok',
        onOk: () => {
          setHistory(history.filter((data) => data.videoId !== videoId));
          Toast.show({
            text: 'Item Removed!',
          });
          closeDialog();
        },
      },
      cancel: {
        cancelText: 'Cancel',
        onCancel: () => {
          closeDialog();
        },
      },
    });
  });
  return (
    <div
      className="rounded-lg"
      {...bindLongPress(`fav-${videoId}`)}
      onClick={() => {
        navigate(`/play/${videoId}`);
        // get  index
        const i = history.findIndex((item) => item.videoId === videoId);
        setGlobalQueue({
          currentIndex: i,
          contents: history,
        });
      }}
    >
      <ListItem
        contentClassName="bg-md-light-surface-3 dark:bg-md-dark-surface-3 m-0! my-3! rounded-lg"
        titleWrapClassName="line-clamp-2"
        link
        chevronMaterial={false}
        title={title}
        //   after="$15"
        subtitle={channel}
        media={
          <div
            className="image w-20 h-18 bg-md-light-primary dark:bg-md-dark-primary rounded-lg flex items-center justify-center"
            style={{
              backgroundImage: `url('https://i.ytimg.com/vi/${videoId}/mqdefault.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
        }
      />
    </div>
  );
};

export default HistCard;
