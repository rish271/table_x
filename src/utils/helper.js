export const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

export const generateRandomName = () => {
    const firstNames = [
      "Alice", "Bob", "Charlie", "David", "Eve", 
      "Fiona", "George", "Hannah", "Ian", "Jasmine"
    ];
    const lastNames = [
      "Smith", "Johnson", "Brown", "Taylor", "Anderson",
      "Thomas", "Jackson", "White", "Harris", "Martin"
    ];
  
    const randomFirstName =
      firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName =
      lastNames[Math.floor(Math.random() * lastNames.length)];
  
    return `${randomFirstName} ${randomLastName}`;
  };