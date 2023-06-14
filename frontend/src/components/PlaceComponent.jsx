import { GoogleMap, InfoWindow, Marker, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";

const libraries = ["places"];
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};
const center = {
  lat: 18.52043,
  lng: 73.856743,
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const PlaceComponent = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCtmCju0FDrKF1BPs_1GhISf9j1_6I2v4I",
    libraries,
  });
  const [mapRef, setMapRef] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });


  const markers = [
    { address: "Address1", lat: 18.5204, lng: 73.8567 },
    { address: "Address2", lat: 18.5314, lng: 73.8446 },
    { address: "Address3", lat: 18.5642, lng: 73.7769 },
  ];

  const onMapLoad = (map) => {
    setMapRef(map);
    const bounds = new window.google.maps.LatLngBounds();
    markers?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds);
  };

  const handleMarkerClick = (id, lat, lng, address) => {
    mapRef?.panTo({ lat, lng });
    setInfoWindowData({ id, address });
    setIsOpen(true);
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setCoordinates({ lat, lng });
  };



  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return (
    <div className="App">
      <div>
        <p>lat: {coordinates.lat}</p>
        <p>lng: {coordinates.lng}</p>
      </div>

     
      <br/>

      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={10}
          center={center}
          options={options}
          onLoad={onMapLoad}
          onClick={handleMapClick}
        >
          {coordinates.lat && coordinates.lng && (
            <Marker position={coordinates} />
          )}
          {markers.map(({ address, lat, lng }, ind) => (
            <Marker
              key={ind}
              position={{ lat, lng }}
              onClick={() => {
                handleMarkerClick(ind, lat, lng, address);
              }}
            >
              {isOpen && infoWindowData?.id === ind && (
                <InfoWindow
                  onCloseClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <h3>{infoWindowData.address}</h3>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      )}
    </div>
  );
};

export default PlaceComponent;







