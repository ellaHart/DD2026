"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function UpdateDestinationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [formData, setFormData] = useState({
        name: "",
        page: "",
        description: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:3001/api/destinations/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    setFormData({
                        name: data.name,
                        page: data.page,
                        description: data.description,
                    });
                });
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("page", formData.page);
            data.append("description", formData.description);
            if (imageFile) {
                data.append("image", imageFile);
            }

            const response = await fetch(`http://localhost:3001/api/destinations/${id}`, {
                method: "PUT",
                body: data
            });
            if (!response.ok) {
                throw new Error("Failed to update destination");
            }
            setSuccess(true);
            router.push("/destinations");
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[600px] w-full">
            <h1 className="text-3xl font-bold">Edit Destination</h1>
            {success && <p className="text-green-500 font-bold mt-2">Destination updated successfully! ✅</p>}
            <form className="mt-4" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block w-full font-bold" htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block w-full font-bold" htmlFor="page">Page:</label>
                    <input
                        type="text"
                        id="page"
                        name="page"
                        value={formData.page}
                        onChange={handleChange}
                        className="border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block w-full font-bold" htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block w-full font-bold" htmlFor="image">Image:</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        className="border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    {error && <p className="text-red-500">{error}</p>}
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Destination"}
                    </button>
                </div>
            </form>
        </div>
    );
}