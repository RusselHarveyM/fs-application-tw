import { useEffect, useState } from 'react';
import { getUsersData } from '@/data/Api';
import { columns } from './columns/columns';
import { DataTable } from './data-table';

export default function Page() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUsersData();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={userData} />
    </div>
  );
}
