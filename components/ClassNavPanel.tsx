"use client";

import React, { useState } from "react";

const ClassNavPanel = () => {
  const [selectedClass, setSelectedClass] = useState("EEE-4232-Class-2");

  const courses = [
    {
      id: "EEE-4232",
      name: "EEE 4232",
      classes: [
        { id: "EEE-4232-Class-1", name: "--- Class 1" },
        { id: "EEE-4232-Class-2", name: "--- Class 2" },
        { id: "EEE-4232-Class-3", name: "--- Class 3" },
        { id: "EEE-4232-Class-4", name: "--- Class 4" },
      ],
    },
    {
      id: "CSE-2222",
      name: "CSE 2222",
      classes: [
        { id: "CSE-2222-Class-1", name: "--- Class 1" },
        { id: "CSE-2222-Class-2", name: "--- Class 2" },
        { id: "CSE-2222-Class-3", name: "--- Class 3" },
        { id: "CSE-2222-Class-4", name: "--- Class 4" },
      ],
    },
  ];

  return (
    <div className="h-full bg-neutral-100 px-4 py-8">
      <div className="border border-neutral-300 p-6 h-full overflow-y-auto">
        {courses.map((course) => (
          <div key={course.id} className="mb-6 pl-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-6 h-0.5 bg-black" />
              <h3 className="text-lg font-semibold text-black hover:text-neutral-600">
                {course.name}
              </h3>
            </div>
            <div className="flex flex-col items-center">
              {course.classes.map((classItem) => (
                <button
                  key={classItem.id}
                  onClick={() => setSelectedClass(classItem.id)}
                  className={`py-1.5 font-medium rounded-lg transition-colors duration-50 w-3/5 pr-4 ${
                    selectedClass === classItem.id
                      ? "bg-[#016FFF] text-white"
                      : "bg-transparent text-gray-700 hover:bg-[#016FFF1A]"
                  }`}
                >
                  {classItem.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassNavPanel;
