"use client";
import { useState, useEffect } from "react";

interface Destination {
  _id: string;
  name: string;
  image: string;
  description: string;
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    // Simulate fetching destinations from an API
    const fetchDestinations = async () => {
      // Replace this with your actual API call
      const response = await fetch("http://localhost:3001/api/destinations");
      const data = await response.json();
      setDestinations(data);
      console.log(data)
    };

    fetchDestinations();
  }, []);


  return (
    <div>
      <h1 className="text-3xl font-bold">Manage Destinations</h1>
      <table className="table-auto w-full border-collapse border border-gray-400">
  <thead>
    <tr>
      <th className="border border-gray-600 p-2">Name</th>
      <th className="border border-gray-600 p-2">Description</th>
      <th className="border border-gray-600 p-2">Actions</th>
    </tr>
  </thead>
  <tbody>
    { destinations.map((destination) => (
      <tr key={destination._id}>
        <td className="border border-gray-600 p-2">{destination.image}</td>
        <td className="border border-gray-600 p-2">{destination.name}</td>
        <td className="border border-gray-600 p-2">{destination.description}</td>
        <td className="border border-gray-600 p-2 w-[200px]">
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          href={`/destinations/edit/?id=${destination._id}`}>
            Edit
          </a>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">
            Delete
          </button>
        </td>
      </tr>
    ))}
    
    
  </tbody>
</table>
    </div>
  );
}