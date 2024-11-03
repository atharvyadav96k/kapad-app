import * as FileSystem from 'expo-file-system';

const fileUri = `${FileSystem.documentDirectory}productId.txt`;

export const storeIdInFile = async (id: string): Promise<void> => {
  if (!id) {
    console.error('Invalid token, cannot write to file');
    return;
  }
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
    return id;
  } catch (error) {
    console.error('Error reading ID from file:', error);
    return null;
  }
};

export const deleteIdFile = async (): Promise<void> => {
  try {
    const fileExists = await FileSystem.getInfoAsync(fileUri);
    if (fileExists.exists) {
      await FileSystem.deleteAsync(fileUri);
      console.log('ID file deleted successfully');
    } else {
      console.log('No ID file found to delete');
    }
  } catch (error) {
    console.error('Error deleting ID file:', error);
  }
};