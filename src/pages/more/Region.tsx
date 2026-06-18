import { useState } from 'react';
import { IoMdGlobe } from 'react-icons/io';
import { countryArray } from '../../utils/countries';
import { useDataStore } from '../../zustand/app_data_store';
import { Toast } from '@capacitor/toast';

const Region = () => {
  const { setHomeSongs, setglobalDialogData } = useDataStore();
  const updateRegion = () => {
    const c = sessionStorage.getItem('tCountry') || 'IN';
    localStorage.setItem('country', c); //  this will finally be auto taken by api service library
    //   also clear out home page music:
    Toast.show({
      text: 'Region Updated',
    });
    setHomeSongs({ music: [] });
    window.location.reload();
  };
  return (
    <div
      className="flex gap-4 items-center py-2 rounded-lg"
      onClick={() => {
        setglobalDialogData({
          isOpen: true,
          title: 'Region',
          ok: {
            okText: 'Save',
            onOk: updateRegion,
          },
          cancel: {
            cancelText: 'Cancel',
          },
          children: <CountrySelection />,
        });
      }}
    >
      <IoMdGlobe size={24} />
      <div className="info w-full">
        <div className="title  font-semibold">Region</div>
      </div>
    </div>
  );
};

export default Region;

export const CountrySelection = () => {
  const [country, setcountry] = useState(localStorage.getItem('country') || 'IN');
  return (
    <div>
      <div>Select your country or region</div>
      <div>
        <select
          name="country"
          id="selectCountry"
          className="outline-none w-full my-2"
          value={country}
          onChange={(e) => {
            setcountry(e.target.value);
            sessionStorage.setItem('tCountry', e.target.value);
          }}
        >
          {countryArray.map((item) => (
            <option key={item.code} value={item.code} className="text-black">
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
