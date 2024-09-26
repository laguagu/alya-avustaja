// Funktio, joka käsittelee lihavoinnit ja numeroidut listat
export const formatMessage = (content: string) => {
  const lines = content.split("\n");

  return lines.map((line, lineIndex) => {
    // Käsittele lihavoinnit
    const boldParts = line.split(/(\*\*.*?\*\*)/g).map((part, partIndex) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={`bold-${lineIndex}-${partIndex}`}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    // Tarkista, onko rivi numeroitu lista-alkio
    const listMatch = line.match(/^(\d+)\.\s(.+)/);
    if (listMatch) {
      const [, number, text] = listMatch;
      const formattedText = text
        .split(/(\*\*.*?\*\*)/g)
        .map((part, partIndex) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={`bold-${lineIndex}-${partIndex}`}>
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

      return (
        <div key={`list-item-${lineIndex}`} className="flex items-start mb-2">
          <span className="mr-2 font-bold">{number}.</span>
          <span>{formattedText}</span>
        </div>
      );
    } else if (line.trim().startsWith("-")) {
      // Käsittele alaluettelot
      const listItemText = line
        .trim()
        .substring(1)
        .trim()
        .split(/(\*\*.*?\*\*)/g)
        .map((part, partIndex) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={`bold-${lineIndex}-${partIndex}`}>
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

      return (
        <div
          key={`sublist-item-${lineIndex}`}
          className="ml-6 flex items-start mb-2"
        >
          <span className="mr-2">•</span>
          <span>{listItemText}</span>
        </div>
      );
    } else {
      return (
        <p key={`line-${lineIndex}`} className="mb-2">
          {boldParts}
        </p>
      );
    }
  });
};
