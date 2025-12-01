import React from 'react';
import Releases from '../components/Releases';

const ReleasesPage: React.FC = () => {
  return (
    <div className="pt-8 min-h-screen animate-fade-in">
      <Releases />
    </div>
  );
};

export default ReleasesPage;