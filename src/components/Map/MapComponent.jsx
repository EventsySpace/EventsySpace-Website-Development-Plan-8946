import React, { useEffect, useRef, useState } from 'react';

const MapComponent = ({ spaces = [], selectedSpace, onSpaceSelect, onMapMove }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxLoaded, setMapboxLoaded] = useState(false);

  // Set your Mapbox access token directly here
  const MAPBOX_TOKEN = 'pk.eyJ1IjoiZXZlbnRzeXNwYWNlIiwiYSI6ImNtZG03ZHUxMjFheHEyanM1cXN2amQ1Y24ifQ.SE94HrautldezuRZg0mX_g';

  // Check if Mapbox is loaded
  useEffect(() => {
    // Ensure we have the mapboxgl object from the window
    if (window.mapboxgl) {
      console.log('Mapbox GL JS is loaded');
      setMapboxLoaded(true);
    } else {
      console.log('Loading Mapbox GL JS from CDN...');
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js';
      script.async = true;
      script.onload = () => {
        console.log('Mapbox GL JS loaded successfully');
        setMapboxLoaded(true);
      };
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  // Initialize map when Mapbox is loaded
  useEffect(() => {
    if (!mapboxLoaded || !mapContainer.current) return;

    // Only initialize the map once
    if (!map.current) {
      try {
        console.log('Initializing Mapbox map...');
        window.mapboxgl.accessToken = MAPBOX_TOKEN;
        map.current = new window.mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [-98.5795, 39.8283], // Center of USA
          zoom: 3.5,
          attributionControl: false
        });

        map.current.on('load', () => {
          console.log('Mapbox map loaded successfully');
          setMapLoaded(true);
        });

        map.current.on('error', (e) => {
          console.error('Mapbox map error:', e);
        });

        map.current.on('moveend', () => {
          if (onMapMove && map.current) {
            const bounds = map.current.getBounds();
            onMapMove(bounds);
          }
        });

        // Add navigation control
        map.current.addControl(
          new window.mapboxgl.NavigationControl(),
          'top-right'
        );

        // Add geolocate control
        map.current.addControl(
          new window.mapboxgl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
            showUserHeading: true
          }),
          'top-right'
        );
      } catch (error) {
        console.error('Error initializing Mapbox:', error);
        setMapLoaded(false);
      }
    }

    // Cleanup function to remove the map when component unmounts
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxLoaded]);

  // Handle markers whenever spaces or selectedSpace changes
  useEffect(() => {
    // Don't update markers if map isn't loaded or there's no map instance
    if (!mapLoaded || !map.current || !window.mapboxgl) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (!spaces || spaces.length === 0) return;

    // Create bounds object to fit map to all markers
    const bounds = new window.mapboxgl.LngLatBounds();
    let validCoordinates = false;

    // Add markers for each space
    spaces.forEach(space => {
      if (!space.coordinates) return;

      try {
        // Create marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.style.cssText = `
          background: ${selectedSpace === space.id ? '#0ea5e9' : 'white'};
          border: 2px solid #0ea5e9;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          color: ${selectedSpace === space.id ? 'white' : '#0ea5e9'};
          font-weight: 600;
          font-size: 12px;
        `;
        markerElement.innerHTML = `$${space.price_per_hour}`;

        // Add hover effects
        markerElement.addEventListener('mouseenter', () => {
          markerElement.style.transform = 'scale(1.1)';
          markerElement.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
        });

        markerElement.addEventListener('mouseleave', () => {
          if (selectedSpace !== space.id) {
            markerElement.style.transform = 'scale(1)';
            markerElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
          }
        });

        // Create marker
        const marker = new window.mapboxgl.Marker(markerElement)
          .setLngLat([space.coordinates.lng, space.coordinates.lat])
          .addTo(map.current);

        // Create popup but don't add to map yet
        const popup = new window.mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false
        }).setHTML(`
          <div style="width: 200px;padding: 12px;">
            <h3 style="font-size: 16px;font-weight: 600;margin-bottom: 4px;">${space.title}</h3>
            <p style="font-size: 14px;color: #6b7280;margin-bottom: 8px;">
              📍 ${space.location}
            </p>
            <div style="font-size: 16px;font-weight: 700;color: #0ea5e9;">$${space.price_per_hour}/hr</div>
          </div>
        `);

        // Add click event to marker
        markerElement.addEventListener('click', (e) => {
          e.stopPropagation();
          if (onSpaceSelect) {
            onSpaceSelect(space.id);
          }
        });

        // Add hover events for popup
        markerElement.addEventListener('mouseenter', () => {
          popup.addTo(map.current);
          marker.setPopup(popup);
        });

        markerElement.addEventListener('mouseleave', () => {
          popup.remove();
        });

        markersRef.current.push(marker);

        // Extend bounds to include this marker
        bounds.extend([space.coordinates.lng, space.coordinates.lat]);
        validCoordinates = true;
      } catch (error) {
        console.error('Error creating marker for space:', space.id, error);
      }
    });

    // Fit map to bounds if we have valid coordinates
    if (validCoordinates && !bounds.isEmpty()) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12
      });
    }
  }, [mapLoaded, spaces, selectedSpace, onSpaceSelect]);

  // Focus on selected space
  useEffect(() => {
    if (!mapLoaded || !selectedSpace || !map.current || !spaces) return;

    const selectedSpaceData = spaces.find(space => space.id === selectedSpace);
    if (selectedSpaceData?.coordinates) {
      try {
        map.current.flyTo({
          center: [selectedSpaceData.coordinates.lng, selectedSpaceData.coordinates.lat],
          zoom: 14,
          duration: 1000
        });
      } catch (error) {
        console.error('Error flying to selected space:', error);
      }
    }
  }, [selectedSpace, mapLoaded, spaces]);

  if (!mapboxLoaded) {
    return (
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mb-4"></div>
          <p className="text-gray-600">Loading Mapbox...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div 
        ref={mapContainer} 
        className="absolute inset-0" 
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
      />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="loading-spinner mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;