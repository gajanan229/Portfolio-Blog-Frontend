import React, { useEffect, useState } from 'react';

function WorkExperience() {
    const [workExperiences, setWorkExperiences] = useState([]);
    const [selectedJob, setSelectedJob] = useState(workExperiences[0]);

    useEffect(() => {
        // Fetch the data from your backend
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/work-experiences');
                if (!res.ok) {
                    throw new Error('Failed to fetch work experiences');
                }
                const data = await res.json();
                setWorkExperiences(data);
                // Default to first job if the array isn't empty
                if (data.length > 0) {
                    setSelectedJob(data[0]);
                }
            } catch (error) {
                console.error('Error fetching work experiences:', error);
            }
        };
        fetchData();
    }, []);
    
      // If no data is available, show a loading or fallback UI
    if (workExperiences.length === 0 || !selectedJob) {
        return (
            <div id="work" className="min-h-screen text-white flex items-center justify-center">
            <p>Loading work experiences...</p>
            </div>
        );
    }

    return (
        <section id="work" className="min-h-screen text-white px-8 py-12">
          {/* Heading */}
            <div className="mb-12 text-center">
                <p className="text-sm uppercase text-purple-400 tracking-wider mb-2">
                My Professional Journey
                </p>
                <h1 className="text-3xl md:text-4xl font-bold">
                Work Experience
                </h1>
            </div>
        
            {/* Container */}
            <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
                {/* Left: Job List */}
                <div className="md:w-1/3 rounded-lg p-4">
                <ul className="space-y-2">
                    {workExperiences.map((job) => (
                    <li
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className={`
                        cursor-pointer p-3 rounded transition
                        ${
                            selectedJob.id === job.id 
                            ? 'bg-purple-700' 
                            : 'bg-gray-700 hover:bg-gray-600'
                        }
                        `}
                    >
                        <h3 className="font-medium">{job.title}</h3>
                        <p className="text-sm text-gray-300">{job.company}</p>
                    </li>
                    ))}
                </ul>
                </div>
        
                {/* Right: Detailed View */}
                <div className="md:w-2/3 bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-purple-400 mb-2">
                    {selectedJob.title} - {selectedJob.company}
                </h2>
                <p className="text-sm text-gray-300 mb-4">
                    {selectedJob.location}
                </p>
                <p className="text-sm text-gray-400 mb-6">
                    {selectedJob.date_range}
                </p>
                <div className="space-y-3">
                    {Array.isArray(selectedJob.details) && selectedJob.details.map((detail, index) => (
                    <p key={index} className="text-gray-200 leading-relaxed">
                        {detail}
                    </p>
                    ))}
                </div>
                </div>
            </div>
        </section>
    );
}

export default WorkExperience;