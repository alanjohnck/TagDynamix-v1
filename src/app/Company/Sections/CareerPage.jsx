import React from 'react';

const JobListing = ({ position, department, location }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-t border-gray-200 space-y-2 sm:space-y-0">
      <span className="font-medium">{position}</span>
      <div className="flex flex-col sm:flex-row sm:items-center text-sm sm:text-base space-y-1 sm:space-y-0 sm:space-x-8">
        <span className="text-gray-600">{department}</span>
        <span className="text-gray-600">{location}</span>
      </div>
    </div>
  );
};

const CareersPage = () => {
  const jobs = [
    {
      position: 'Service Engineer',
      department: 'Operations',
      location: 'Limerick, India'
    },
    {
      position: 'Automation Engineer',
      department: 'Engineering',
      location: 'Bangalore,India'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-16">
      {/* Team Section */}
      <section>
        <h1 className="text-4xl sm:text-6xl font-bold mb-4 sm:mb-6">Team</h1>
        <div className="bg-gray-200 rounded-lg sm:rounded-xl w-full aspect-[2/1]">
          {/* Placeholder for team image or content */}
        </div>
      </section>

      {/* Hiring & Careers Section */}
      <section className="space-y-6 sm:space-y-8">
        <div className="space-y-1 sm:space-y-2">
          <span className="text-red-500 text-xs sm:text-sm">
            {jobs.length} Open Position{jobs.length !== 1 && 's'}
          </span>
          <h2 className="text-xl sm:text-4xl font-bold">Hiring &amp; Careers</h2>
        </div>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
          We&apos;re looking for creative, collaborative, and kind humans to join with us.
        </p>

        {/* Job Listings */}
        <div className="space-y-2 sm:space-y-4">
          <h3 className="font-medium text-base sm:text-lg mb-2 sm:mb-4">
            Build future with us
          </h3>
          <div className="space-y-0">
            {jobs.map((job, index) => (
              <JobListing
                key={index}
                position={job.position}
                department={job.department}
                location={job.location}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;