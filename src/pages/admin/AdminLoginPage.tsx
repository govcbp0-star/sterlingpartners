import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { adminUid, getFirebaseSetupMessage } from "../../lib/firebase";
import { auth } from "../../lib/firebaseAuth";
import { useAdminAuth } from "../../contexts/useAdminAuth";

function loginErrorMessage(error: unknown) {
  const code = error && typeof error === "object" && "code" in error
    ? String(error.code)
    : "";

  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
    return "The email or password is incorrect.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many sign-in attempts. Wait a moment and try again.";
  }
  if (code === "auth/network-request-failed") {
    return "The sign-in request could not reach Firebase. Check your connection and try again.";
  }
  return error instanceof Error ? error.message : "Sign-in failed. Please try again.";
}

export default function AdminLoginPage() {
  const { user, isAdmin, loading } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setupMessage = getFirebaseSetupMessage();

  if (loading) {
    return <main className="admin-page"><div className="admin-panel">Checking sign-in session…</div></main>;
  }

  if (isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (setupMessage) {
      setError(setupMessage);
      return;
    }
    if (!auth) {
      setError("Firebase Authentication is unavailable. Check the Firebase setup.");
      return;
    }

    setSubmitting(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (credential.user.uid !== adminUid) {
        await signOut(auth);
        setError("This account is not authorized for the admin dashboard.");
      }
    } catch (signInError) {
      setError(loginErrorMessage(signInError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnauthorizedSignOut = async () => {
    if (auth) await signOut(auth);
  };

  return (
    <main className="admin-page admin-login-page">
      <section className="admin-login-card" aria-labelledby="admin-login-heading">
        <Link to="/" className="admin-brand">Sterling Legal Partners</Link>
        <span className="eyebrow">ADMINISTRATION</span>
        <h1 id="admin-login-heading">Sign in to manage profiles</h1>
        <p className="admin-muted">Use the email and password for the authorized Firebase account.</p>

        {setupMessage && <p className="admin-notice is-warning" role="status">{setupMessage}</p>}
        {!adminUid && !setupMessage && (
          <p className="admin-notice is-warning" role="status">
            Configure the single authorized admin UID before using this dashboard.
          </p>
        )}

        {user && !isAdmin ? (
          <div className="admin-notice is-error" role="alert">
            <p>This signed-in Firebase account is not the authorized admin.</p>
            <button className="admin-button admin-button-secondary" type="button" onClick={handleUnauthorizedSignOut}>
              Sign out
            </button>
          </div>
        ) : (
          <form className="admin-form" onSubmit={handleSubmit}>
            <label className="admin-field">
              <span>Email</span>
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>Password</span>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            {error && <p className="admin-notice is-error" role="alert">{error}</p>}

            <button className="admin-button admin-button-primary" type="submit" disabled={submitting || Boolean(setupMessage)}>
              {submitting ? "Signing in…" : "Sign in"}
            </button>
            <p className="admin-login-footnote">Public account registration is not available.</p>
          </form>
        )}

        <Link to="/" className="admin-back-link">Return to the website</Link>
      </section>
    </main>
  );
}
