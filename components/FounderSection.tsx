import React from 'react';

export const FounderSection: React.FC = () => {
  return (
    <section id="about" className="bg-white text-black py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-center text-center md:text-left">
        
        {/* 🔴 QR Code on the Left */}
        <div className="flex flex-col items-center md:items-start space-y-3">
          <p className="text-xl font-bold text-green-600">Help us grow</p>
          <img
            src="/support-qr.png"
            alt="Support QR"
            className="w-40 h-40 object-contain rounded-md shadow-md"
          />
        </div>

        {/* 🟠 Founder Image in the Middle */}
        <div className="flex justify-center">
          <img
            src="/rayzor.jpg"
            alt="Rayzor Jung"
            className="w-60 h-60 object-cover rounded-full border-4 border-blue-700 shadow-lg"
          />
        </div>

        {/* 🔵 Founder Bio on the Right */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold">Meet Our Founder</h2>
          <h3 className="text-xl font-semibold text-blue-800">Rayzor Jung</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            Rayzor Jung is a music producer who's been in the game for over 8 years.
            His beats have racked up millions of views on YouTube, even earning him a
            Silver Play Button. He built this website to give back to the community — 
            a platform where Nepali artists, producers, and mixing engineers can connect,
            grow, and sell their work. It's the first of its kind for Nepali hip-hop.
          </p>
        </div>
      </div>
    </section>
  );
};


export default FounderSection;

