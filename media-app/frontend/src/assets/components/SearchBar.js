import React from 'react';
import { Input } from '@nextui-org/react';
import { CiSearch } from 'react-icons/ci';

const SearchBar = ({ className, onSearch }) => {
    return (
        <div className="search-bar-container">
            <Input
                label="Search"
                isClearable
                radius="lg"
                className={className}
                placeholder="Type to search..."
                onChange={(e) => onSearch(e.target.value)} // Pass search value to parent
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onSearch(e.target.value); // Trigger search on Enter
                    }
                }}
                startContent={
                    <CiSearch className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                }
            />
        </div>
    );
};

export default SearchBar;
