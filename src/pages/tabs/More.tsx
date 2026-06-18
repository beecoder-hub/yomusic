import ImportExport from '../more/ImportExport';
import Region from '../more/Region';
import ShareP from '../more/ShareP';
import About from '../more/About';
import Updates from '../more/Updates';
import PirvacyPolicy from '../more/PirvacyPolicy';
import HistoryC from '../more/History';
// import SleepTimer from "../more/SleepTimer";

const More = () => {
  const options = [
    {
      title: 'History',
      component: <HistoryC />,
    },
    {
      title: 'Your Data',
      component: <ImportExport />,
    },
    {
      title: 'Region',
      component: <Region />,
    },
    {
      title: 'Share',
      component: <ShareP />,
    },
    {
      title: 'Updates',
      component: <Updates />,
    },
    // {
    //   title: "SleepTimer",
    //   component: <SleepTimer />,
    // },
    {
      title: 'About',
      component: <About />,
    },
    {
      title: 'PrivacyPolicy',
      component: <PirvacyPolicy />,
    },
  ];

  return (
    <div>
      <div className="title font-semibold text-lg my-4">More</div>
      {/* settings list */}
      <div className="flex flex-col gap-4 pb-4">
        {options.map((item) => (
          <div key={item.title}>{item.component}</div>
        ))}
      </div>
    </div>
  );
};

export default More;
