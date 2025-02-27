import { GeoPoint } from '@/interfaces/IProperty';
import { FetchResponse, IFetch } from '../useFetch';
import { Building } from './useBuildingsApi';
import { Parcel } from './useParcelsApi';
import { PropertyTypes } from '@/constants/propertyTypes';
import { ClassificationType } from '@/constants/classificationTypes';
import { CommonFiltering } from '@/interfaces/ICommonFiltering';
import { useContext } from 'react';
import { ConfigContext } from '@/contexts/configContext';
import { useSSO } from '@bcgov/citz-imb-sso-react';

export interface PropertyFuzzySearch {
  Parcels: Parcel[];
  Buildings: Building[];
}

export interface PropertyGeo {
  type: 'Feature';
  properties: {
    Id: number;
    Location: GeoPoint;
    PropertyTypeId: PropertyTypes;
    ClassificationId: ClassificationType;
    Name: string;
    AdministrativeAreaId: number;
    AgencyId: number;
    PID?: number;
    PIN?: number;
    Address1: string;
  };
  geometry: {
    type: 'Point';
    coordinates: [49.212751465, -122.873862825];
  };
}

export interface MapFilter {
  PID?: number;
  PIN?: number;
  Address?: string;
  AgencyIds?: number[];
  AdministrativeAreaIds?: number[];
  ClassificationIds?: number[];
  PropertyTypeIds?: number[];
  RegionalDistrictIds?: number[];
  Name?: string;
}

export interface PropertyUnion {
  PID?: number;
  PIN?: number;
  Address: string;
  Agency: string;
  AdministrativeArea: string;
  RegionalDistrict: string;
  Name: string;
  UpdatedOn: Date;
  PropertyType: string;
}

export interface ImportResult {
  FileName: string;
  CompletionPercentage: number;
  Id: number;
  Results: {
    action: 'inserted' | 'updated' | 'error' | 'ignored';
    rowNumber: number;
    reason?: string;
  }[];
  CreatedById: string;
  CreatedOn: Date;
  UpdatedById?: string;
  UpdatedOn?: Date;
}

export interface PropertiesUnionResponse {
  properties: PropertyUnion[];
  totalCount: number;
}

const usePropertiesApi = (absoluteFetch: IFetch) => {
  const config = useContext(ConfigContext);
  const keycloak = useSSO();

  const propertiesFuzzySearch = async (keyword: string) => {
    const { parsedBody } = await absoluteFetch.get('/properties/search/fuzzy', {
      keyword,
      take: 2,
    });
    return parsedBody as PropertyFuzzySearch;
  };

  // Retrieves properties for map population
  const propertiesGeoSearch = async (filter: MapFilter) => {
    const noNullParam = filter
      ? Object.fromEntries(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          Object.entries(filter).filter(([_, v]) => {
            // No empty arrays
            if (Array.isArray(v) && v.length === 0) return false;
            // No undefined or null
            return v != null;
          }),
        )
      : undefined;
    const { parsedBody } = await absoluteFetch.get('/properties/search/geo', noNullParam);
    return parsedBody as PropertyGeo[];
  };

  const getPropertiesUnion = async (filter: CommonFiltering, signal?: AbortSignal) => {
    const { parsedBody } = await absoluteFetch.get('/properties', filter, { signal });
    return parsedBody as PropertiesUnionResponse;
  };

  const propertiesDataSource = async (
    filter: CommonFiltering,
    signal?: AbortSignal,
  ): Promise<PropertiesUnionResponse> => {
    try {
      const response = await getPropertiesUnion(filter, signal);

      // Extract properties and totalCount from the response
      const { properties } = response;
      const totalCount = response.totalCount;

      return {
        properties,
        totalCount,
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Fetch aborted');
      } else {
        console.error('Error fetching properties:', error);
      }
      return {
        properties: [],
        totalCount: 0,
      };
    }
  };

  const uploadBulkSpreadsheet = async (file: File) => {
    const form = new FormData();
    form.append('spreadsheet', file, file.name);
    const result = await fetch(config.API_HOST + '/properties/import', {
      method: 'POST',
      body: form, //Using standard fetch here instead of the wrapper so that we can handle this form-data body without converting to JSON.
      headers: { Authorization: keycloak.getAuthorizationHeaderValue() },
    });
    const text = await result.text();
    (result as FetchResponse).parsedBody = JSON.parse(text);
    return result;
  };

  const getImportResults = async (filter: CommonFiltering, signal?: AbortSignal) => {
    const { parsedBody } = await absoluteFetch.get('/properties/import/results', filter, {
      signal,
    });
    return parsedBody as ImportResult[];
  };

  return {
    propertiesFuzzySearch,
    propertiesGeoSearch,
    getPropertiesUnion,
    uploadBulkSpreadsheet,
    getImportResults,
    propertiesDataSource,
  };
};

export default usePropertiesApi;
