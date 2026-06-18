import { useEffect, useState } from 'react';
import { countryArray } from '../utils/countries';
import { Button } from 'konsta/react';
import { useDataStore } from '../zustand/app_data_store';
import appLogo from '../assets/app-icon-128px.png';

// Show first time country chooser page  if country is not initially set locally.
const InitCountry = ({
  hasCountry,
  setHasCountry,
}: {
  hasCountry: boolean;
  setHasCountry: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [country, setcountry] = useState(() => {
    return localStorage.getItem('country') || 'IN';
  });
  const { setHomeSongs } = useDataStore();

  const setRegion = () => {
    const c = sessionStorage.getItem('tCountry') || 'IN';
    localStorage.setItem('country', c); //  this will finally be auto taken by api service library
    // also clear out home page music to trigger new home page data based on selected country!
    setHomeSongs({ music: [] });
    window.location.reload();
  };

  useEffect(() => {
    const ls = localStorage.getItem('country');
    if (!ls) {
      setHasCountry(false);
    }
  }, []);

  return (
    !hasCountry && (
      <div className="fixed z-100 top-[0] left-0 w-full h-screen flex flex-col items-center justify-center gap-4 bg-md-light-secondary-container dark:bg-md-dark-secondary-container">
        <div
          className="size-20 bg-center bg-contain bg-no-repeat"
          style={{ backgroundImage: `url(${appLogo})` }}
        ></div>
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
        <div className="w-7/10">
          <Button onClick={setRegion} rounded>
            Continue
          </Button>
        </div>
      </div>
    )
  );
};

export default InitCountry;
