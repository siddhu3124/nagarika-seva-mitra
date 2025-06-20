
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LocationData {
  district: string;
  mandal: string;
  village: string;
}

interface UseLocationDataReturn {
  districts: string[];
  mandals: string[];
  villages: string[];
  getMandalsByDistrict: (district: string) => string[];
  getVillagesByMandal: (district: string, mandal: string) => string[];
  loading: boolean;
  error: string | null;
}

export const useLocationData = (): UseLocationDataReturn => {
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    try {
      console.log('🗺️ Fetching Telangana location data...');
      const { data, error } = await supabase
        .from('telangana_locations')
        .select('district, mandal, village')
        .order('district')
        .order('mandal')
        .order('village');

      if (error) {
        console.error('❌ Error fetching location data:', error);
        setError(error.message);
      } else {
        console.log('✅ Location data fetched:', data?.length, 'records');
        setLocationData(data || []);
      }
    } catch (err: any) {
      console.error('💥 Error in fetchLocationData:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get unique districts
  const districts = [...new Set(locationData.map(item => item.district))].sort();

  // Get unique mandals
  const mandals = [...new Set(locationData.map(item => item.mandal))].sort();

  // Get unique villages
  const villages = [...new Set(locationData.map(item => item.village))].sort();

  // Get mandals for a specific district
  const getMandalsByDistrict = (district: string): string[] => {
    const districtMandals = locationData
      .filter(item => item.district === district)
      .map(item => item.mandal);
    return [...new Set(districtMandals)].sort();
  };

  // Get villages for a specific district and mandal
  const getVillagesByMandal = (district: string, mandal: string): string[] => {
    const mandalVillages = locationData
      .filter(item => item.district === district && item.mandal === mandal)
      .map(item => item.village);
    return [...new Set(mandalVillages)].sort();
  };

  return {
    districts,
    mandals,
    villages,
    getMandalsByDistrict,
    getVillagesByMandal,
    loading,
    error
  };
};
