export function getConditionDescription(condition) {
  switch (condition) {
    case "New":
      return "Item is unused, in its original packaging, and typically retains the full manufacturer's warranty.";
    case "Like New":
      return "Item has seen minimal use (e.g., demonstration unit, tested briefly) and is virtually indistinguishable from new.";
    case "Very Good (VG)":
      return "Item shows signs of light use but has been well-maintained. Fully functional with no known issues.";
    case "Good Condition (GC)":
      return "Item shows normal signs of regular use and wear appropriate for its age/hours but has been adequately maintained and is fully functional.";
    case "Fair Condition (FC)":
      return "Item shows significant signs of heavy use and cosmetic wear. Operational but likely requires repairs or significant maintenance soon.";
    case "Poor Condition (PC)":
      return "Item functions but is well below optimal performance and requires substantial repairs or replacement of major components.";
    case "For Parts / Not Working":
      return "Item is non-operational or has critical failures rendering it unusable in its current state. Sold specifically for salvageable components.";
    default:
      return "";
  }
}
