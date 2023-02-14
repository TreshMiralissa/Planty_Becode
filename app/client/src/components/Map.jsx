import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import React from "react";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const TREES_URL = "/api/tree/all";

export default function Map() {
  const latitude = 50.6327565;
  const longitude = 5.5686243;

  //const urlIcon = ("./images/icon-tree.png");
  const iconTree = new L.Icon({
    iconUrl: ("http://localhost:5173/src/images/icon-tree.png"),
    iconSize: [20, 30],
    iconAnchor: [5, 30]
});


  function MapView() {
    let map = useMap();
    map.setView([latitude, longitude], map.getZoom());
    //Sets geographical center and zoom for the view of the map  
    return null;
  }

  const [trees, setTrees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTrees = async () => {
    try {
      const response = await axios.get(TREES_URL);
      //console.log(response.data[10].lat);
      setTrees(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTrees()
    //console.log(trees)
    setIsLoading(false)
  }, []);

  return (

    <MapContainer
      className="map"
      center={[latitude, longitude]}
      zoom={20}
      scrollWheelZoom={true}
      preferCanvas
      style={{ height: 80 + "vh"}}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> 
          contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
        {trees.map((tree, index) => {
          return (
          <Marker position={{lat: tree.lat, lon: tree.lon}} key={index} icon={iconTree}>
            <Popup>
    
            </Popup>  
          </Marker>)
            })}
        </MarkerClusterGroup>
        <MapView />
      </MapContainer>
    )};







