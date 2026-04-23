"use client";
import { useState, useEffect } from "react";

export default function Welcome() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/destinations")
      .then((res) => res.json())
      .then((data) => setDestinations(data));
  }, []);

  function handleData() {
    fetch("http://localhost:3001/api/destinations")
      .then((res) => res.json())
      .then((data) => {
        setDestinations(data);
        console.log(data);
      });
  }

  return (
    <div className="mt-4 mx-auto">
      <h1>Welcome to Next.js!</h1>
      <p>This is a simple example of a Next.js application.</p>
      <h2>Destinations</h2>
      <ul>
        {destinations.map((destination) => (
          <li key={destination._id}>
            {destination.name}
            <img
              src={`http://localhost:3001${destination.image}`}
              alt={destination.name}
              className="w-[200px]"
            />
            <a href={`/welcome/${destination._id}`} className="text-blue-500">
              View Details
            </a>
          </li>
        ))}
      </ul>
      <button
        onClick={handleData}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Refresh Destinations
      </button>
    </div>
  );
}