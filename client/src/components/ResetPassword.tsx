
import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { supabase } from '../lib/supabase'

interface ResetPasswordProps {
  onComplete: () => void
}

function ResetPassword({
  onComplete,
}: ResetPasswordProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (
    event: SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setError('')

    if (password.length < 8) {
      setError(
        'Password must contain at least 8 characters.'
      )
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const { data: sessionData } =
        await supabase.auth.getSession()

      if (!sessionData.session) {
        throw new Error(
          'Your recovery session has expired. Please request another password reset link.'
        )
      }

      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        })

      if (updateError) {
        throw updateError
      }

      setSuccess(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">

        <div className="reset-password-brand">
          MEDIA<span>VAULT</span>
        </div>

        {success ? (
          <>
            <h1>Password Updated</h1>

            <p>
              Your password has been changed
              successfully.
            </p>

            <button
              type="button"
              className="reset-password-submit"
              onClick={onComplete}
            >
              Continue to MediaVault
            </button>
          </>
        ) : (
          <>
            <h1>Create New Password</h1>

            <p>
              Enter and confirm your new password
              to regain access to your collection.
            </p>

            <form onSubmit={handleSubmit}>
              <label>
                New Password

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  minLength={8}
                  required
                  autoComplete="new-password"
                />
              </label>

              <label>
                Confirm Password

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  minLength={8}
                  required
                  autoComplete="new-password"
                />
              </label>

              {error && (
                <p
                  className="reset-password-error"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="reset-password-submit"
                disabled={loading}
              >
                {loading
                  ? 'Updating Password...'
                  : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ResetPassword
