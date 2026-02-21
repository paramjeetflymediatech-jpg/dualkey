"use client";
import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationMarker({ position, setPosition, setCoordinates }) {
  const map = useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);

      // Reverse geocode to get address details
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/geocoding/reverse?lat=${lat}&lon=${lng}`,
        );
        const data = await response.json();
        const fullData = {
          lat,
          lng,
          address: data.display_name || "",
          city:
            data.address?.city ||
            data.address?.town ||
            data.address?.suburb ||
            "",
          state: data.address?.state || "",
          country: data.address?.country || "",
          postcode: data.address?.postcode || "",
        };
        setCoordinates(fullData);
      } catch (error) {
        console.error("Error reverse geocoding:", error);
        setCoordinates({ lat, lng });
      }

      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : <Marker position={position}></Marker>;
}

function SearchField({ setPosition, setCoordinates }) {
  const [query, setQuery] = useState("");
  const map = useMap();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/geocoding/search?q=${encodeURIComponent(query)}`,
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPos = {
          lat: parseFloat(lat),
          lng: parseFloat(lon),
          address: data[0].display_name,
          city:
            data[0].address?.city ||
            data[0].address?.town ||
            data[0].address?.suburb ||
            "",
          state: data[0].address?.state || "",
          country: data[0].address?.country || "",
          postcode: data[0].address?.postcode || "",
        };
        setPosition(newPos);
        setCoordinates(newPos);
        map.flyTo(newPos, 13);
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  return (
    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-[1000] bg-white p-2 rounded shadow-md flex gap-2">
      <input
        type="text"
        placeholder="Enter address..."
        className="border p-1 rounded w-64"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="bg-brand-blue text-white px-3 py-1 rounded"
        type="button"
      >
        Search
      </button>
    </div>
  );
}

export default function MapPicker({
  onLocationSelect,
  initialLat,
  initialLng,
}) {
  const [position, setPosition] = useState(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null,
  );

  useEffect(() => {
    if (initialLat && initialLng) {
      setPosition({ lat: initialLat, lng: initialLng });
    }
  }, [initialLat, initialLng]);

  const setCoordinates = (data) => {
    onLocationSelect(
      data.lat,
      data.lng,
      data.address,
      data.city,
      data.state,
      data.country,
      data.postcode,
    );
  };

  return (
    <div className="h-[400px] w-full relative border rounded z-0">
      <MapContainer
        center={position || { lat: -37.8136, lng: 144.9631 }}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SearchField
          setPosition={setPosition}
          setCoordinates={setCoordinates}
        />
        <LocationMarker
          position={position}
          setPosition={setPosition}
          setCoordinates={setCoordinates}
        />
      </MapContainer>
    </div>
  );
}
