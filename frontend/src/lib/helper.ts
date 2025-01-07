// Generate random 6-letter/digit id.
export function generateId () {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters[randomIndex];
  }
  return id;
}

// Cosine similarity to determine how close vectors are (used as how similar two groups of people are)

export function cosineSimilarity(arrayOne: number[], arrayTwo: number[]): number {
    // Step 1: Calculate the dot product of the two arrays
    const dotProduct = arrayOne.reduce((sum, val, index) => sum + val * arrayTwo[index], 0);

    // Step 2: Calculate the magnitudes (norms) of the arrays
    const magnitudeA = Math.sqrt(arrayOne.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(arrayTwo.reduce((sum, val) => sum + val * val, 0));

    // Step 3: Calculate cosine similarity
    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;  // If either vector is a zero vector, return similarity as 0
    }
    
    return dotProduct / (magnitudeA * magnitudeB);
}