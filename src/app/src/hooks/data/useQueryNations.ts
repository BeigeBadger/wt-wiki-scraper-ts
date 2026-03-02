import { gql, useQuery } from '@apollo/client';
import { handleGqlError } from '../../lib/toastUtils';

export const NATIONS_QUERY = gql`
  query Nations {
    countries {
      id
      name
    }
  }
`;

export interface Nation {
  id: string;
  name: string;
}

export interface NationsQueryResult {
  countries: Nation[];
}

export function useQueryNations() {
  return useQuery<NationsQueryResult>(NATIONS_QUERY, {
    onError: handleGqlError,
  });
}
