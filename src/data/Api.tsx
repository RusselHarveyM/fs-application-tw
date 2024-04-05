export async function getUsersData() {
    try {
      const response = await fetch('https://fs-backend-copy-production.up.railway.app/api/user'); //change this to our deployed api
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      const usersData = data.map((user) => ({
        ...user,
        Name: `${user.firstName} ${user.lastName}`,
      }));
      return usersData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return [];
    }
}

export async function getBuildingsData() {
    try {
        const response = await fetch('https://fs-backend-copy-production.up.railway.app/api/buildings'); //change this to our deployed api
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return [];
      }
}
  
export async function getRoomsData() {
    try {
        const response = await fetch('https://fs-backend-copy-production.up.railway.app/api/rooms'); //change this to our deployed api
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return [];
      }
}
  
export async function getSpacesData() {
    try {
        const response = await fetch('https://fs-backend-copy-production.up.railway.app/api/space'); //change this to our deployed api
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return [];
      }
}