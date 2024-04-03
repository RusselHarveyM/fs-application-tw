import React from 'react';

const SpaceContent = () => {
  return (
    <div className="flex h-screen">
      <button>
        Back
      </button>
      {/* Side Navigation Bar */}
      <div className="bg-gray-200 w-1/5">
        {/* Add your navigation items here */}
        <ul className="py-4">
          <li className="px-4 py-2">Item 1</li>
          <li className="px-4 py-2">Item 2</li>
          <li className="px-4 py-2">Item 3</li>
        </ul>
      </div>
      {/* Main content */}
      <div className="flex-1 bg-white">
        {/* Your main content here */}
        <div className="flex flex-col w-full m-auto py-6 px-8">
          {/* Add your main content here */}
          <h1>Main Content</h1>
        </div>
      </div>
    </div>
  );
}

export default SpaceContent;
