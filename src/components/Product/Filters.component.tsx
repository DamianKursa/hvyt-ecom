interface FiltersProps {
  attributes: any[]; // Adjust this type according to your attributes data structure
}

const Filters = ({ attributes }: FiltersProps) => {
  return (
    <div className="filters">
      <h3 className="text-xl font-semibold mb-4">Filtry</h3>
      {attributes?.nodes?.length > 0 ? ( // Check if attributes and nodes exist
        attributes.nodes.map((attribute) => (
          <div key={attribute.name} className="mb-4">
            <h4 className="font-medium">{attribute.name}</h4>
            <select className="w-full border p-2 rounded">
              {attribute.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))
      ) : (
        <p>No filters available</p>
      )}
    </div>
  );
};

export default Filters;
