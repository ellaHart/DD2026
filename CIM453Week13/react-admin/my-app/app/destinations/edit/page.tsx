"use client";
import { useState, useEffect } from "react";
import { redirect, useSearchParams } from "next/navigation";

// form fields: name, page, description,image  
export default function UpdateDestinationPage() {
    
    const router = useSearchParams();
useEffect(() => {
    // Simulate fetching destinations from an API
    const fetchDestination = async () => {
      // Replace this with your actual API call
      const response = await fetch("http://localhost:3001/api/destinations/"+router.get('id'));

      const data = await response.json();
      
      setFormData(data);

      console.log(data)
    };

    fetchDestination();
  }, []);

    const [formData, setFormData] = useState({
        name: "",
        page: "",
        description: "",
        image: null as File | null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        console.log(formData);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({
                ...formData,
                image: e.target.files[0]
            });
        }
    };


    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        // Here you would typically send formData to your backend API
        console.log("Form submitted:", formData);
        const body = new FormData();
        body.append("name", formData.name);
        body.append("page", formData.page);
        body.append("description", formData.description);
        if (formData.image) {
            body.append("image", formData.image);
        }

        try {
            // fetch the data 
            const response = await fetch("http://localhost:3001/api/destinations", {
                method: "POST",
                body: body
            });
            if (!response.ok) {
                throw new Error("Failed to add destination");
            } else {
                // everything worked.. send the user back to destinations page 
                
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
            redirect('/destinations');
           
        }

 


    }


  return (
        <div className="max-w-[600px] w-full">
            <h1 className="text-3xl font-bold">Edit Destination {router.get('id')}</h1>
            <form className="mt-4" onSubmit={handleSubmit}>
                
                <div className="mb-4">
                    <label className="block w-full font-bold" htmlFor="name">
                        Name:
                    </label>
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
                    <label className="block w-full font-bold" htmlFor="page">
                        Page:
                    </label>
                    <input 
                    type="text"
                    id="page"
                    name="page"
                    onChange={handleChange}
                    value={formData.page}
                    className="border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>  

                  <div className="mb-4">
                    <label className="block w-full font-bold" htmlFor="description">
                        Description:
                    </label>
                    <textarea
                    id="description"
                    name="description"
                    className="border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleChange}
                    value={formData.description}
                    /> 
                    
                  </div>                    
                    <div className="mb-4">
                    <label className="block w-full font-bold" htmlFor="image">
                        Image:
                    </label>
                    <input 
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div> 
                  <div className="mb-4">
                    {error && <p className="text-red-500">{error}</p>}
                    <button type="submit" 
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    disabled={loading}
                    >
                        Add Destination
                    </button>
                    </div> 

            </form>
        
        </div>
  );   
}
         