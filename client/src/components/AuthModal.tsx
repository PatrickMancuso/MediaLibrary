import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { supabase } from '../lib/supabase'

interface AuthModalProps {
  onClose: () => void
}

function AuthModal({
  onClose,
}: AuthModalProps) {
  const [mode, setMode] =
    useState<'signin' | 'signup'>('signin')

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const [message, setMessage] =
    useState('')

 const handleSubmit = async (
  event: SubmitEvent<HTMLFormElement>,
) => {
    event.preventDefault()

    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (mode === 'signin') {
        const {
          error: signInError,
        } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          throw signInError
        }

        onClose()
        return
      }

     const {
  data,
  error: signUpError,
} = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo:
      window.location.origin,
  },
})

      if (signUpError) {
        throw signUpError
      }

      if (
        data.user &&
        !data.session
      ) {
        setMessage(
          'Account created. Check your email to verify your account.',
        )
      } else {
        setMessage(
          'Account created successfully.',
        )
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="auth-backdrop"
      onClick={onClose}
    >
      <section
        className="auth-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="auth-close"
          onClick={onClose}
          aria-label="Close account dialog"
        >
          ×
        </button>

        <div className="auth-header">
          <p className="auth-eyebrow">
            MEDIA LIBRARY
          </p>

          <h2>
            {mode === 'signin'
              ? 'Sign In'
              : 'Create Account'}
          </h2>

          <p>
            {mode === 'signin'
              ? 'Sign in to access your collection.'
              : 'Create an account to keep your collection across devices.'}
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <label>
            Email

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              autoComplete="email"
            />
          </label>

          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              minLength={6}
              autoComplete={
                mode === 'signin'
                  ? 'current-password'
                  : 'new-password'
              }
            />
          </label>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          {message && (
            <p className="auth-message">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : mode === 'signin'
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'signin'
            ? 'Need an account?'
            : 'Already have an account?'}

          <button
            type="button"
            onClick={() => {
              setMode(
                mode === 'signin'
                  ? 'signup'
                  : 'signin',
              )

              setError('')
              setMessage('')
            }}
          >
            {mode === 'signin'
              ? 'Create Account'
              : 'Sign In'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default AuthModal