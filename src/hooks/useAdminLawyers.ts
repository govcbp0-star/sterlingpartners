import { useEffect, useState } from "react";
import { subscribeToAdminLawyers } from "../data/adminLawyerRepository";
import type { ProfileSnapshot } from "../data/lawyerRepository";

type AdminLawyersState = ProfileSnapshot & { loading: boolean; error: string | null };

const initialState: AdminLawyersState = {
  profiles: [],
  invalidCount: 0,
  loading: true,
  error: null,
};

export function useAdminLawyers() {
  const [state, setState] = useState({ ...initialState, attempt: 0 });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToAdminLawyers(
      ({ profiles, invalidCount }) => setState({ profiles, invalidCount, loading: false, error: null, attempt }),
      (error) => setState({ profiles: [], invalidCount: 0, loading: false, error: error.message, attempt }),
    );

    return unsubscribe;
  }, [attempt]);

  return {
    ...state,
    loading: state.loading || state.attempt !== attempt,
    retry: () => setAttempt((value) => value + 1),
  };
}
