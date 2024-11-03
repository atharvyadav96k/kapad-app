import * as FileSystem from 'expo-file-system';

const fileUri = `${FileSystem.documentDirectory}proudctId.txt`;

export const storeIdInFile = async (id: string): Promise<void> => {
  try {
    await FileSystem.writeAsStringAsync(fileUri, id);
    console.log('ID stored successfully');
  } catch (error) {
    console.error('Error writing ID to file:', error);
  }
};

export const readIdFromFile = async (): Promise<string | null> => {
  try {
    const id = await FileSystem.readAsStringAsync(fileUri);
    console.log('Fetched ID:', id);
    return id; // Return the fetched ID
  } catch (error) {
    console.error('Error reading ID from file:', error);
    return null; // Return null if an error occurs
  }
};
