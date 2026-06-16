import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabaseUrl = 'https://cfhnprrrbxrtoibhyzvs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmaG5wcnJyYnhydG9pYmh5enZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwMDY0NzYsImV4cCI6MjA0MzU4MjQ3Nn0.k62zGX4CzYz4qL_6Foy2bT-pGz4x2P0uVd4L2c1pS8M'

const supabase = createClient(supabaseUrl, supabaseKey)

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  if (loading) return <div style={{padding: 40}}>Loading...</div>

  return (
    <div style={{padding: 40, fontFamily: 'sans-serif'}}>
      <h1>Supabase Google Login Test</h1>
      {user ? (
        <div>
          <p>Logged in as: {user.email}</p>
          <p>User ID: {user.id}</p>
          <img src={user.user_metadata.avatar_url} width="80" style={{borderRadius: '50%'}} />
          <br/><br/>
          <button onClick={signOut} style={{padding: '10px 20px', fontSize: 16}}>
            Sign Out
          </button>
        </div>
      ) : (
        <button onClick={signInWithGoogle} style={{padding: '10px 20px', fontSize: 16}}>
          Sign In with Google
        </button>
      )}
    </div>
  )
        }
