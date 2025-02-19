import React, { useState, useRef, useEffect, memo } from "react";

const Dropdown = memo(
  ({ label, options, select, style, img, onChange = () => {} }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState(label);
    const ref = useRef(null);

    useEffect(() => {
      setTitle(label);
    }, [label]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);

    const handleOptionClick = (title, val) => {
      setTitle(title);
      select(val);
      setIsOpen(false);

      if (onChange()) {
        onChange(val);
      }
    };

    return (
      <div className="relative lg:w-60" ref={ref}>
        <button
          className={`dropdown:block w-full relative px-3 py-2 text-sm font-semibold leading-relaxed  transition-colors duration-150 bg-white dark:bg-indigo-950 border border-gray-300 rounded-lg focus:outline-none hover:border-gray-600 focus:shadow-outline focus:border-gray-900 dark:focus:border-gray-100 ${style} `}
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-center">
            {/* SVG code */}
            <span className="px-2 text-gray-700 dark:text-gray-200">{title}</span>
            {/* SVG code */}
          </div>
        </button>

        {isOpen && (
          <ul
            className="absolute w-full py-2 mt-1 space-y-1 text-sm bg-blue-100 dark:bg-blue-950 border border-blue-500 rounded-lg shadow-lg z-50 not"
            aria-label="submenu"
          >
            {options?.map(({ title, value, img }, id) => {
              return (
                <button
                  className="flex items-center justify-center w-full  py-1 font-medium border-b border-blue-500 last:border-0 transition-colors duration-150  hover:text-gray-900 focus:outline-none focus:shadow-outline hover:bg-gray-100"
                  href="#"
                  onClick={() => handleOptionClick(title, value)}
                  key={id}
                >
                  {img ? <img src={img} className="w-6 mr-2" alt={img} /> : ""}
                  {title}
                </button>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
);

export default Dropdown;
