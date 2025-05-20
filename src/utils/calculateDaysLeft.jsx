export const calculateDaysUntilExpiration = (expirationDateString) => {
  // Return "N/A" if expiration date is not provided
  if (!expirationDateString || expirationDateString === "N/A") {
    return "N/A";
  }

  try {
    // Parse the expiration date
    const expirationDate = new Date(expirationDateString);

    // Get today's date (at midnight to avoid time differences affecting calculation)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate the difference in milliseconds
    const differenceMs = expirationDate - today;

    // Convert to days and round down
    const daysLeft = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

    // Handle expired products
    if (daysLeft < 0) {
      return "Expired";
    }

    return `${daysLeft} days`;
  } catch (error) {
    console.error("Error calculating expiration:", error);
    return "Error";
  }
};
