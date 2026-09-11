import { useState, useEffect, useCallback, useRef } from "react";

// Fetches data from the API and tracks the four states a page has to handle: loading, error, empty and data.
// request is a function returning a promise, normally one of the functions from services/api.js, e.g. useFetch(getStudents). It is held in a ref so passing an inline arrow function does not restart the request on every render.
export default function useFetch(request) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const requestRef = useRef(request);
  requestRef.current = request;

  // Guards against setting state after the component has gone away, which happens whenever the user navigates away while a request is in flight.
  const mounted = useRef(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await requestRef.current();
      if (mounted.current) setData(result);
    } catch (err) {
      if (mounted.current) setError(err.message || "Something went wrong");
    } finally {
      // Runs on success and failure alike, so a failed request can never leave a loading spinner on screen.
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    load();
    return () => {
      mounted.current = false;
    };
  }, [load]);

  return { data, loading, error, reload: load };
}
