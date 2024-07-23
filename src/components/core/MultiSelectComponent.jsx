import React, { useState } from 'react';
import Select from 'react-select';

const MultiSelectComponent = ({ options, setSelectedOptions, selectedOptions }) => {
  // const [selectedOptions, setSelectedOptions] = useState([]);
  console.log(selectedOptions)
  // Options for the select input
  // const options = [
  //   { value: 'apple', label: 'Apple' },
  //   { value: 'orange', label: 'Orange' },
  //   { value: 'banana', label: 'Banana' },
  //   { value: 'grape', label: 'Grape' },
  //   { value: 'strawberry', label: 'Strawberry' }
  // ];

  // Handle change event
  const handleChange = selectedOption => {
    setSelectedOptions(selectedOption);
  };

  return (
    <Select
      isMulti
      value={selectedOptions}
      onChange={handleChange}
      options={options}
    />
  );
};

export default MultiSelectComponent;
