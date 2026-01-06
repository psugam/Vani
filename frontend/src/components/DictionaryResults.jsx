import React from "react";
import PropTypes from "prop-types";
import DictionaryEntry from "./DictionaryEntry";

export default function DictionaryResults({ data }) {
  return (
    <div className="max-w-3xl mx-auto my-6 space-y-4">
      {data.map((entryWrapper, idx) => (
        <DictionaryEntry key={idx} entryWrapper={entryWrapper} />
      ))}
    </div>
  );
}

DictionaryResults.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
