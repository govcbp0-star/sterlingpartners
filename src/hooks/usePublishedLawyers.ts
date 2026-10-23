import { useEffect, useState } from "react";
import { subscribeToPublishedLawyers, type ProfileSnapshot } from "../data/lawyerRepository";

type LawyersState = ProfileSnapshot & { loading: boolean; error: string | null };

const initialState: LawyersState = {
  profiles: [],
  invalidCount: 0,
  loading: true,
  error: null,
};

export function usePublishedLawyers() {
  const [state, setState] = useState({ ...initialState, attempt: 0 });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToPublishedLawyers(
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
