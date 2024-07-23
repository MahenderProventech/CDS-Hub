import React, { useState } from 'react';
import { MultiSelect } from 'react-multi-select-component';

const CustomMultiSelect = ({ options }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleChange = (selected) => {
        setSelectedOptions(selected);
    };

    const formatSelectedOptions = () => {
        console.log("calledddddddd")
        const selectedCount = selectedOptions.length;
        console.log(selectedCount)
        if (selectedCount === 0) {
            console.log('Select options')
            return 'Select options11';
        } else if (selectedCount === 1) {
            return selectedOptions[0].label;
        } else if (selectedCount === options.length) {
            return 'All options selected';
        } else {
            console.log(`${selectedOptions[0].label} + ${selectedCount - 1} more`)
            return `${selectedOptions[0].label} + ${selectedCount - 1} more`;

        }
    };

    return (
        <MultiSelect
            options={options}
            // options={formatSelectedOptions()}
            value={selectedOptions}
            onChange={handleChange}
            labelledBy="Select"
            overrideStrings={{ selectSomeItems: formatSelectedOptions() }}
        />
    );
};

export default CustomMultiSelect;
