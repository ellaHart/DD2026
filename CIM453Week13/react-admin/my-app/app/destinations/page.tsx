"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Destination {
  _id: string;
  name: string;
  image: string;
  description: string;
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      const response = await fetch("http://localhost:3001/api/destinations");
      const data = await response.json();
      setDestinations(data);
      console.log(data);
    };
    fetchDestinations();
  }, []);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.getAttribute("data-id");
    if (!id) return;

    try {
      const response = await fetch(`http://localhost:3001/api/destinations/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete destination");
      } else {
        setDestinations(destinations.filter(dest => dest._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Manage Destinations</h1>
      <table className="table-auto w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-600 p-2">Image</th>
            <th className="border border-gray-600 p-2">Name</th>
            <th className="border border-gray-600 p-2">Description</th>
            <th className="border border-gray-600 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {destinations.map((destination) => (
            <tr key={destination._id}>
              <td className="border border-gray-600 p-2">
                <img
                  src={`http://localhost:3001/${destination.image}`}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
              </td>
              <td className="border border-gray-600 p-2">{destination.name}</td>
              <td className="border border-gray-600 p-2">{destination.description}</td>
              <td className="border border-gray-600 p-2 w-[200px]">
                <Link
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  href={`/destinations/edit/?id=${destination._id}`}
                >
                  Edit
                </Link>
                <button
                  data-id={destination._id}
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                >
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